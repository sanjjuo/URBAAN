import React from "react";
import { Drawer } from "@material-tailwind/react";
import { RiHeart3Fill, RiHeart3Line, RiSearch2Line } from "react-icons/ri";
import { useContext } from "react";
import { AppContext } from "../../../StoreContext/StoreContext";
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { MdZoomOutMap } from "react-icons/md";
import { ImageZoomModal } from "../ImageZoomModal/ImageZoomModal";
import { UserNotLoginPopup } from "../UserNotLogin/UserNotLoginPopup";

export function SearchDesktopDrawer({ open, closeSearchDrawer }) {
    const { BASE_URL, searchUser, setSearchUser, searchedProducts, handleOpenUserNotLogin, openUserNotLogin, setSearchedProducts, favProduct, setFav, } = useContext(AppContext);
    const [heartIcons, setHeartIcons] = useState({})
    const [openImageModal, setOpenImageModal] = React.useState(false);
    const [zoomImage, setZoomImage] = useState(null)

    //handle image zoom
    const handleOpenImageZoom = (productImages, index) => {
        setOpenImageModal(!openImageModal);
        setZoomImage({ images: productImages, currentIndex: index });
    }

    useEffect(() => {
        const fetchUserSearchProducts = async () => {
            if (searchUser.trim() === '') {
                return setSearchedProducts([]); // Clear results if search is empty
            }
            try {
                const response = await axios.get(`${BASE_URL}/user/search/view?query=${searchUser}`)
                setSearchedProducts(response.data.products) // Setting the search results
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserSearchProducts()
    }, [searchUser, BASE_URL, setSearchedProducts])

    // add to wishlist
    const handleWishlist = async (productId, productTitle) => {
        try {
            const userId = localStorage.getItem('userId')
            if (!userId) {
                handleOpenUserNotLogin();
                return;
            }

            const payload = { userId, productId }

            // Check if product is already in wishlist
            const isInWishlist = favProduct?.items?.some(item => item.productId?._id === productId)

            if (!isInWishlist) {
                const response = await axios.post(`${BASE_URL}/user/wishlist/add`, payload)
                console.log(response.data)

                setHeartIcons(prevState => ({
                    ...prevState,
                    [productId]: true
                }))

                setFav((prevFav) => {
                    const isAlreadyFav = prevFav.some(
                        (item) => item.productId === payload.productId
                    );
                    return isAlreadyFav ? prevFav : [...prevFav, payload];
                });


                toast.success(`${productTitle} added to wishlist`)
            } else {
                toast.error('Product already in wishlist')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <React.Fragment>
            <Drawer open={open} onClose={closeSearchDrawer} className="p-4 overflow-y-scroll hide-scrollbar" placement='bottom' size={750}>
                <div className="flex flex-col items-center justify-center my-20">
                    <div onClick={closeSearchDrawer} className='absolute right-5 top-5 z-50 cursor-pointer'>
                        <HiXMark className='text-4xl' />
                    </div>
                    <div className='xl:w-[650px] lg:w-[650px] border-b-2 border-gray-700'>
                        <ul>
                            <li className='w-full flex items-center gap-2 text-sm p-4 rounded-full placeholder:font-normal bg-transparent placeholder:text-gray-700'>
                                <input
                                    type="search"
                                    name="search"
                                    value={searchUser}
                                    onChange={(e) => setSearchUser(e.target.value)}
                                    placeholder='Search Products, Brands, Categories...'
                                    className='bg-transparent text-lg placeholder:text-gray-600 placeholder:text-lg font-light focus:outline-none text-secondary w-full'
                                />
                                <RiSearch2Line className='text-gray-600 text-3xl' />
                            </li>
                        </ul>
                    </div>
                    {/* <div className='mt-5 flex flex-col justify-center items-center'>
                        <p className='uppercase text-sm tracking-wider text-center'>popular searches</p>
                        <ul className='mt-5 flex flex-wrap items-center gap-2'>
                            <li className='text-sm text-primary border-[1px] border-primary rounded-xl px-3 py-2'>Kurti</li>
                            <li className='text-sm text-primary border-[1px] border-primary rounded-xl px-3 py-2'>Night Wear</li>
                        </ul>
                    </div> */}
                </div>
                <div className="xl:py-5 xl:px-32 lg:py-5 lg:px-32 font-normal">
                    {searchUser.length === 0 ? (
                        <></>
                    ) : (
                        <div className='grid grid-cols-5 gap-5'>
                            {searchedProducts.map((product) => {
                                const isInWishlist = favProduct?.items?.some(item => item.productId?._id === product._id)
                                return (
                                    <div className='group relative' key={product._id}>
                                        <Link
                                            to="/product-details"
                                            state={{
                                                productId: product._id,
                                                categoryId: product.category._id
                                            }}
                                            onClick={closeSearchDrawer}
                                            className="cursor-pointer">
                                            <div className='w-full h-52 xl:h-80 lg:h-80 rounded-xl overflow-hidden'>
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className='w-full h-full object-cover rounded-xl shadow-md transition transform scale-100 duration-500 ease-in-out cursor-pointer group-hover:scale-105'
                                                    onError={(e) => e.target.src = '/no-image.jpg'}
                                                />
                                            </div>
                                        </Link>
                                        <MdZoomOutMap
                                            onClick={() => handleOpenImageZoom(product.images, 0)}
                                            className='absolute top-2 left-2 cursor-pointer text-gray-600 bg-white w-7 h-7 xl:w-8 xl:h-8 lg:w-8 lg:h-8 p-1 rounded-full shadow-md'
                                        />
                                        {heartIcons[product._id] || isInWishlist ? (
                                            <RiHeart3Fill
                                                onClick={() => handleWishlist(product._id, product.title)}
                                                className='absolute top-2 right-2 cursor-pointer text-primary bg-white w-7 h-7 xl:w-8 xl:h-8 lg:w-8 lg:h-8 p-1 rounded-full shadow-md'
                                            />
                                        ) : (
                                            <RiHeart3Line
                                                onClick={() => handleWishlist(product._id, product.title)}
                                                className='absolute top-2 right-2 cursor-pointer bg-white text-gray-600 w-7 h-7 xl:w-8 xl:h-8 lg:w-8 lg:h-8 p-1 rounded-full shadow-md'
                                            />
                                        )}
                                        <div className='mt-3'>
                                            <h4 className='font-medium text-sm xl:text-lg lg:text-lg capitalize'>{product.title}</h4>
                                            <p className='text-gray-600 font-normal text-xs xl:text-sm lg:text-sm capitalize truncate overflow-hidden 
                                                whitespace-nowrap w-40 xl:w-60 lg:w-60'>
                                                {product.description}
                                            </p>
                                            <p className='text-primary text-base xl:text-xl lg:text-xl font-semibold mt-2'>
                                                ₹{product.offerPrice}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </Drawer>

            <UserNotLoginPopup
                title='You are not logged in'
                description='Please log in or create an account to add items to your wishlist and keep track of your favorites.'
                open={openUserNotLogin}
                handleOpen={handleOpenUserNotLogin}
            />

            <ImageZoomModal
                open={openImageModal}
                handleOpen={handleOpenImageZoom}
                zoomImage={zoomImage}
            />
        </React.Fragment>
    );
}