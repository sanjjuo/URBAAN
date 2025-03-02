import React, { useContext, useState } from 'react'
import {
    Navbar,
    Typography,
    Button,
} from "@material-tailwind/react";
import { RiSearch2Fill, RiSearch2Line } from "react-icons/ri";
import { IoMenu } from "react-icons/io5";
import BottomBar from '../BottomBar/BottomBar';
import { AppContext } from '../../../StoreContext/StoreContext';
import MobileSidebar from './MobileSidebar';
import { CategoryMenu } from './CategoryMenu';
import { Link, useLocation } from 'react-router-dom';
import { UserProfile } from './UserProfile';
import { useEffect } from 'react';
import axios from 'axios';
import { SearchDesktopDrawer } from './SearchDesktopDrawer';
import { UserNotLoginPopup } from '../UserNotLogin/UserNotLoginPopup';


const NavList = () => {
    const { cart, fav } = useContext(AppContext)
    const cartView = cart?.length || 0;
    const favView = fav?.length || 0;
    const location = useLocation();
    const [navActive, setNavActive] = useState(() => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path == '/orders-tracking') return 'trackOrder'
        if (path == '/favourite') return 'wishlist'
        if (path == '/user-cart') return 'cart'
    })

    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setNavActive("home");
        if (path === '/orders-tracking') setNavActive("trackOrder");
        if (path === '/favourite') setNavActive("wishlist");
        if (path === '/user-cart') setNavActive("cart");
    }, [location]);

    return (
        <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <Typography
                as="li"
                onClick={() => setNavActive("home")}
                className={`p-1 uppercase text-base font-medium font-custom text-secondary transition-all transform duration-500 ease-in-out 
                    hover:text-primary ${navActive === "home" ? "text-primary scale-110" : ""}`}
            >
                <Link to="/" >
                    Home
                </Link>
            </Typography>
            <Typography
                as="li"
                onClick={() => setNavActive("categories")}
                className={`p-1 uppercase text-base font-medium cursor-pointer font-custom text-secondary transition-all transform duration-500 ease-in-out 
                    hover:text-primary ${navActive === "categories" ? "text-primary scale-110" : ""}`}
            >
                <CategoryMenu />
            </Typography>
            <Typography
                as="li"
                onClick={() => setNavActive("trackOrder")}
                className={`p-1 uppercase text-base font-medium font-custom text-secondary transition-all transform duration-500 ease-in-out 
                    hover:text-primary ${navActive === "trackOrder" ? "text-primary scale-110" : ""}`}
            >
                <Link to='/orders-tracking' >
                    Track Order
                </Link>
            </Typography>
            <Typography
                as="li"
                onClick={() => setNavActive("wishlist")}
                className={`p-1 uppercase text-base font-medium font-custom text-secondary transition-all transform duration-500 ease-in-out 
                    hover:text-primary ${navActive === "wishlist" ? "text-primary scale-110" : ""}`}
            >
                <Link to='/favourite' >
                    Wishlist <span>({favView || 0})</span>
                </Link>
            </Typography>
            <Typography
                as="li"
                onClick={() => setNavActive("cart")}
                className={`p-1 uppercase text-base font-medium font-custom text-secondary transition-all transform duration-500 ease-in-out 
                    hover:text-primary ${navActive === "cart" ? "text-primary scale-110" : ""}`}
            >
                <Link to='/user-cart' >
                    Cart <span>({cartView || 0})</span>
                </Link>
            </Typography>
        </ul>
    );
}

const UserNavbar = () => {
    const { BASE_URL, openDrawer, handleOpenDrawer, handleCloseDrawer, cart, setCart, fav, setFav } = useContext(AppContext)
    const location = useLocation();
    const isFavouritePage = location.pathname === "/favourite";
    const isCartPage = location.pathname === "/user-cart";
    const isSearch = location.pathname === '/user-search'
    const cartView = cart?.length || 0;
    const favView = fav?.length || 0;
    const [openSearchDrawer, setOpenSearchDrawer] = useState(false);
    const [openUserNotLogin, setOpenUserNotLogin] = useState(false);

    // handle non logged users modal
    const handleOpenUserNotLogin = () => {
        setOpenUserNotLogin(!openUserNotLogin);
    };

    const handleOpenSearchDrawer = () => setOpenSearchDrawer(true);
    const closeSearchDrawer = () => setOpenSearchDrawer(false);

    const token = localStorage.getItem("userToken")
    const userId = localStorage.getItem('userId');

    //extract details from url for google sign up
    useEffect(() => {
        // Extract query parameters from the URL
        const urlParams = new URLSearchParams(location.search);
        const googleToken = urlParams.get("Token");
        const googleRole = urlParams.get("role");
        const googleUserId = urlParams.get("userId");
        const googleName = urlParams.get("name");

        // Debugging: Log extracted values
        console.log("URL Params:", {
            googleToken,
            googleRole,
            googleUserId,
            googleName,
            fullSearch: location.search,
        });

        // Store these details in local storage if they exist
        if (googleToken) localStorage.setItem("userToken", googleToken);
        if (googleRole) localStorage.setItem("role", googleRole);
        if (googleUserId) localStorage.setItem("userId", googleUserId);
        if (googleName) localStorage.setItem("name", googleName);

        // Confirm what was stored
        console.log("Stored in localStorage:", {
            googleToken: localStorage.getItem("userToken"),
            googleRole: localStorage.getItem("role"),
            googleUserId: localStorage.getItem("userId"),
            googleName: localStorage.getItem("name"),
        });
    }, [location.search]);


    // fetching cart items and fav items for identifying the length initially
    useEffect(() => {
        const fetchCartItems = async () => {
            if (!token || !userId) return;
            try {
                const response = await axios.get(`${BASE_URL}/user/cart/view-cart/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCart(response.data?.items || []);
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
            if (!userId) return;
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

    // pages where navbar don't visible
    const noNavbar = ["/customer-reviews", "/write-review", "/add-delivery-address", "/edit-delivery-address", "/select-delivery-address",
        "/select-tracking", "/order", '/forget-password', '/reset-otp', '/new-password', '/terms-conditions', '/privacy-policy']


    // Check if current path matches any of the visible routes
    if (noNavbar.includes(location.pathname)) {
        return null // dont render navbar
    }

    return (
        <>
            <div className='hidden sticky top-0 w-full z-50 xl:block lg:block bg-white shadow-lg'>
                <Navbar className="mx-auto max-w-screen-xl py-6 px-0 shadow-none rounded-none">
                    <div className="flex items-center justify-between text-blue-gray-900">
                        <div className="!w-28">
                            <Link to='/'>
                                <img src="/logo.png" alt="" className='w-full object-contain' />
                            </Link>
                        </div>
                        <div className="hidden lg:block xl:flex xl:items-center xl:gap-10 lg:items-center lg:gap-10">
                            <NavList />
                        </div>
                        <div>
                            <ul className='flex items-center gap-10'>
                                <li>
                                    <RiSearch2Line onClick={handleOpenSearchDrawer} className='text-secondary text-3xl cursor-pointer hover:text-primary' />
                                </li>
                                <li>
                                    {token ? (
                                        <UserProfile />
                                    ) : (
                                        <Link to='/login-user'><Button className='bg-primary font-custom font-normal
                                      capitalize text-sm'>Log in</Button>
                                        </Link>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </Navbar>
            </div>

            {/* mobile view */}
            <div className='xl:hidden lg:hidden sticky top-0 z-10 flex justify-between items-center bg-white shadow-md py-4 px-4'>
                <ul className='flex items-center gap-5'>
                    <li onClick={handleOpenDrawer} className='text-2xl text-secondary hover:text-primary'><IoMenu /></li>
                    <Link to='/'><li className="w-24 cursor-pointer">
                        <img src="/logo.png" alt="" className='w-full object-contain' />
                    </li></Link>
                </ul>
                <ul className='flex items-center gap-3'>
                    <Link to='/user-search'>
                        <li className='text-2xl text-secondary hover:text-primary'>
                            {isSearch ?
                                <>
                                    <RiSearch2Fill className='text-primary' />
                                </>
                                :
                                <>
                                    <RiSearch2Line />
                                </>
                            }
                        </li>
                    </Link>
                </ul>
            </div>

            <BottomBar cartView={cartView} favView={favView} setCart={setCart} setFav={setFav} />
            <MobileSidebar
                openDrawer={openDrawer}
                handleCloseDrawer={handleCloseDrawer}
            />

            <SearchDesktopDrawer
                open={openSearchDrawer}
                closeSearchDrawer={closeSearchDrawer}
            />

            <UserNotLoginPopup
                open={openUserNotLogin}
                handleOpen={handleOpenUserNotLogin}
            />
        </>
    )
}

export default UserNavbar