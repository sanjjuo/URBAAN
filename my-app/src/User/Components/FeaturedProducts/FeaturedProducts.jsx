import React, { useContext } from 'react';
import { RxHeart } from "react-icons/rx";
import { Link } from 'react-router-dom';
import { AppContext } from '../../../StoreContext/StoreContext';
import { useState } from 'react';
import axios from 'axios';
import AppLoader from '../../../Loader';
import { useEffect } from 'react';
import { RiHeart3Fill, RiHeart3Line } from 'react-icons/ri';
import { UserNotLoginPopup } from '../UserNotLogin/UserNotLoginPopup';
import toast from 'react-hot-toast';
import { Button } from '@material-tailwind/react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdZoomOutMap } from 'react-icons/md';
import { ImageZoomModal } from '../ImageZoomModal/ImageZoomModal';


const FeaturedProducts = () => {
    const { BASE_URL, favProduct, handleOpenUserNotLogin, setFav } = useContext(AppContext);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [heartIcons, setHeartIcons] = useState({});
    const [showAllFeature, setShowAllFeature] = useState(false);
    const [openImageModal, setOpenImageModal] = React.useState(false);
    const [zoomImage, setZoomImage] = useState(null)

    //handle image zoom
    const handleOpenImageZoom = (productImages, index) => {
        setOpenImageModal(!openImageModal);
        setZoomImage({ images: productImages, currentIndex: index });
    }


    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/products/view-products`);
                const filteredProducts = response.data.filter(product => product.isFeaturedProduct);
                setFeaturedProducts(filteredProducts)
                console.log(filteredProducts);
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching offer products:", error);
            }
        }
        fetchFeaturedProducts()
    }, [])

    // add to wishlist
    const handleWishlist = async (productId, productTitle) => {
        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                handleOpenUserNotLogin();
                return;
            }

            // Check if product is already in wishlist
            const isInWishlist = favProduct?.items?.some(item => item.productId?._id === productId);

            if (isInWishlist) {
                // If product is already in wishlist, show the appropriate toast and return
                toast.error(`${productTitle} is already in your wishlist`);
                return; // Stop here without making the API call
            }

            const payload = {
                userId: userId,
                productId: productId
            };

            // Add to wishlist if not already there
            const response = await axios.post(`${BASE_URL}/user/wishlist/add`, payload);
            console.log(response.data);
            // If the response is successful, update the heart icon state and show success toast
            setHeartIcons(prevState => ({
                ...prevState,
                [productId]: !isInWishlist, // Set the heart icon to filled
            }));

            setFav((prevFav) => {
                const isAlreadyFav = prevFav.some(
                    (item) => item.productId === payload.productId
                );
                return isAlreadyFav ? prevFav : [...prevFav, payload];
            });

            toast.success(`${productTitle} added to wishlist`);

        } catch (error) {
            // Check if the error is related to the product already being in the wishlist
            if (error.response && error.response.data.message === "Product is already in the wishlist") {
                toast.error(`${productTitle} is already in your wishlist`);
            } else {
                console.log("Error adding to wishlist:", error);
                toast.error("Failed to add product to wishlist");
            }
        }
    };

    const visibleProducts = showAllFeature ? featuredProducts : featuredProducts.slice(0, 5);

    return (
        <>
            <h1 className='text-secondary text-lg xl:text-2xl lg:text-2xl font-semibold text-center xl:text-left'>Featured Products</h1>
            {
                isLoading ? (
                    <div className="col-span-2 flex justify-center items-center h-[50vh]">
                        <AppLoader />
                    </div>
                ) : featuredProducts.length === 0 ? (
                    <>
                        <p className='col-span-5 flex items-center justify-center h-[50vh]'>No products available</p>
                    </>
                ) : (
                    <>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-5 gap-5 pb-10'>
                            {
                                visibleProducts.map((product) => {
                                    const isInWishlist = favProduct?.items?.some(item => item?.productId?._id === product._id);
                                    return (
                                        <div className='group relative' key={product._id}>
                                            <Link
                                                to="/product-details"
                                                state={{
                                                    productId: product._id,
                                                    categoryId: product.category._id
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <div className='w-full h-52 xl:h-80 lg:h-80 relative rounded-xl overflow-hidden'>
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.title}
                                                        className='w-full h-full object-cover rounded-xl shadow-md
                                                        transition transform scale-100 duration-500 ease-in-out cursor-pointer group-hover:scale-105'
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

                        {featuredProducts.length > 5 && (
                            <div className='flex justify-center items-center pb-8'>
                                <Button
                                    onClick={() => setShowAllFeature(!showAllFeature)}
                                    className='bg-transparent font-custom shadow-none text-black font-normal capitalize text-sm 
                                    flex items-center gap-2 border border-gray-700 rounded-3xl px-3 py-2 hover:shadow-none'
                                >
                                    {showAllFeature ? "Show Less" : "Show More"} {showAllFeature ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                </Button>
                            </div>
                        )}

                        <ImageZoomModal
                            open={openImageModal}
                            handleOpen={handleOpenImageZoom}
                            zoomImage={zoomImage}
                        />
                    </>
                )
            }
        </>
    )
}

export default FeaturedProducts