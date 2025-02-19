import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiHandbagFill, RiHandbagLine, RiHeart3Fill, RiHeart3Line, RiHome5Line } from "react-icons/ri";
import { RiUser3Line } from "react-icons/ri";
import { RiHome5Fill } from "react-icons/ri";
import { RiShoppingCartFill } from "react-icons/ri";
import { RiUser3Fill } from "react-icons/ri";
import { Chip } from '@material-tailwind/react';
import { useContext } from 'react';
import { AppContext } from '../../../StoreContext/StoreContext';
import axios from 'axios';
import { UserNotLoginPopup } from '../UserNotLogin/UserNotLoginPopup';

const BottomBar = ({ cartView, favView, setCart, setFav }) => {
    const { BASE_URL } = useContext(AppContext)
    const location = useLocation();
    const [openUserNotLogin, setOpenUserNotLogin] = useState(false);

    // handle non logged users modal
    const handleOpenUserNotLogin = () => {
        setOpenUserNotLogin(!openUserNotLogin);
    };


    const [iconActive, setIconActive] = useState(() => {
        const path = location.pathname;
        if (path === '/') return "home";
        if (path === '/user-search') return "search";
        if (path === '/user-cart') return "cart";
        if (path === '/user-profile') return "profile";
        return "home";
    })

    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setIconActive("home");
        if (path === '/user-search') setIconActive("search");
        if (path === '/user-cart') setIconActive("cart");
        if (path === '/user-profile') setIconActive("profile");
    }, [location]);

    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');

    //  fetching cart items for identifying the length initially
    useEffect(() => {
        const fetchCartItems = async () => {
            if (!token || !userId) return;
            try {
                const response = await axios.get(`${BASE_URL}/user/cart/view-cart/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCart(response.data.items);
            } catch (error) {
                console.error(error);
                if (error.response.status === 401) {
                    handleOpenUserNotLogin();
                }
            }
        };

        fetchCartItems();
    }, []);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (!userId) {
                console.warn("User ID is missing");
                return;
            }
            try {
                const response = await axios.get(`${BASE_URL}/user/wishlist/view/${userId}`);
                if (response.status === 200 && response.data.items) {
                    setFav(response.data.items);
                } else {
                    console.warn("Wishlist is empty. Setting an empty array.");
                    setFav([]); // Ensure fav list is not undefined
                }
            } catch (error) {
                if (error.response?.status === 404 && error.response.data?.message === "Wishlist not found") {
                    console.warn("Wishlist not found, setting an empty array.");
                    setFav([]); // Handle empty wishlist without an error
                } else {
                    console.error("Error fetching wishlist:", error);
                }
            }
        };
        fetchWishlistProducts();
    }, []);

    // Pages where BottomBar should be visible
    const visibleRoutes = ["/", "/view-all-category", "/favourite", "/user-search", "/user-profile", "/user-cart"];

    // Check if current path matches any of the visible routes
    if (!visibleRoutes.includes(location.pathname)) {
        return null; // Don't render BottomBar
    }

    return (
        <>
            <div className="xl:hidden lg:hidden sm:hidden md:hidden bg-white fixed bottom-0 shadow-xl w-full pt-3 pb-2 px-10 z-50">
                <ul className="flex justify-between items-center">
                    <Link to='/'><li onClick={() => setIconActive("home")} className={`text-gray-700 hover:text-primary flex flex-col items-center
                        ${iconActive === "home" ? "text-primary" : ""}`}>
                        {
                            iconActive === "home" ? (
                                <>
                                    <span><RiHome5Fill className="text-2xl" /></span>
                                </>
                            ) : (
                                <>
                                    <span><RiHome5Line className="text-2xl" /></span>
                                </>
                            )
                        }
                        <span className="text-[11px] h-5 tracking-wider">Home</span>
                    </li></Link>

                    <Link to='/favourite'><li onClick={() => setIconActive("favourite")} className={`text-gray-700 hover:text-primary flex flex-col items-center
                        ${iconActive === "favourite" ? "text-primary" : ""}`}>
                        {
                            iconActive === "favourite" ? (
                                <>
                                    <span className='relative'>
                                        <RiHeart3Fill className="text-2xl" />
                                        {favView > 0 && (
                                            <Chip value={favView || 0} size="sm" className="rounded-full bg-gray-600 text-xs text-white absolute -top-1 -right-2 p-1 w-4 h-4 flex 
                                        justify-center items-center" />
                                        )}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className='relative'>
                                        <RiHeart3Line className="text-2xl" />
                                        {favView > 0 && (
                                            <Chip value={favView || 0} size="sm" className="rounded-full text-xs bg-primary absolute -top-1 -right-2 p-1 w-4 h-4 flex 
                                        justify-center items-center" />
                                        )}
                                    </span>
                                </>
                            )
                        }
                        <span className="text-[11px] h-5 tracking-wider">Wishlist</span>
                    </li></Link>

                    <Link to='/user-cart'><li onClick={() => setIconActive("cart")} className={`text-gray-700 hover:text-primary flex flex-col items-center
                        ${iconActive === "cart" ? "text-primary" : ""}`}>
                        {
                            iconActive === "cart" ? (
                                <>
                                    <span className='relative'>
                                        <RiHandbagFill className="text-2xl" />
                                        {cartView > 0 && (
                                            <Chip value={cartView || 0} size="sm" className="rounded-full bg-gray-500 text-xs text-white absolute -top-1 -right-2 p-1 w-4 h-4 flex 
                                        justify-center items-center" />
                                        )}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className='relative'>
                                        <RiHandbagLine className="text-2xl" />
                                        {cartView > 0 && (
                                            <Chip value={cartView || 0} size="sm" className="rounded-full text-xs bg-primary absolute -top-1 -right-2 p-1 w-4 h-4 flex 
                                        justify-center items-center" />
                                        )}
                                    </span>
                                </>
                            )
                        }
                        <span className="text-[11px] h-5 tracking-wider">Cart</span>
                    </li></Link>

                    <Link to='/user-profile'><li onClick={() => setIconActive("profile")} className={`text-gray-700 hover:text-primary flex flex-col items-center
                        ${iconActive === "profile" ? "text-primary" : ""}`}>
                        {
                            iconActive === "profile" ? (
                                <>
                                    <span><RiUser3Fill className="text-2xl" /></span>
                                </>
                            ) : (
                                <>
                                    <span><RiUser3Line className="text-2xl" /></span>
                                </>
                            )
                        }
                        <span className="text-[11px] h-5 tracking-wider">Profile</span>
                    </li></Link>
                </ul>
            </div>

            <UserNotLoginPopup
                open={openUserNotLogin}
                handleOpen={handleOpenUserNotLogin}
            />
        </>
    );
};

export default BottomBar;
