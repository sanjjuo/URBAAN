import React, { useContext } from 'react'
import { FaStar } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { Button } from '@material-tailwind/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi";
import { AppContext } from '../../../StoreContext/StoreContext';
import { IoHeartOutline } from "react-icons/io5";
import { IoIosArrowBack } from 'react-icons/io';
import { RiHeart3Fill } from 'react-icons/ri';
import SimilarProducts from './SimilarProducts';
import ProductReviews from './ProductReviews';
import { SizeChart } from './SIzeChart';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { TiTick } from "react-icons/ti";
import { useEffect } from 'react';
import { UserNotLoginPopup } from '../UserNotLogin/UserNotLoginPopup';

const ProductDetails = () => {
    const { handleOpenSizeDrawer, BASE_URL, favProduct, setOpenUserNotLogin, setCart, setFav } = useContext(AppContext)
    const location = useLocation();
    const { productId, categoryId } = location.state || {}
    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState([]);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState({});
    const [heartIcons, setHeartIcons] = useState({});
    const [modalTitle, setModalTitle] = useState('');
    const [modalDescription, setModalDescription] = useState('');
    const [showMore, setShowMore] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([])
    const [reviewEligible, setReviewEligible] = useState(false);


    console.log("categry", categoryId);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/review/${productId}`);
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, [productId]);

    const calculateRatings = (reviews) => {
        const totalReviews = reviews.length;

        if (totalReviews === 0) {
            return { averageRating: 0, totalReviews };
        }

        // Calculate average rating
        const averageRating =
            reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;

        // Calculate rating distribution
        const ratingCounts = [0, 0, 0, 0, 0]; // 1 to 5 stars

        reviews.forEach((review) => {
            ratingCounts[review.rating - 1]++; // Count the ratings
        });

        return { averageRating, totalReviews };
    };

    const { averageRating, totalReviews } = calculateRatings(reviews);


    const toggleShowMore = () => {
        setShowMore(!showMore);
    };



    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/products/product/${productId}`);
                setProductDetails(response.data);
                console.log('Product Details:', response.data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        const fetchSimilarProducts = async () => {
            if (!categoryId) {
                console.warn('Invalid categoryId:', categoryId);
                return;
            }

            try {
                const response = await axios.get(`${BASE_URL}/user/products/products/category/${categoryId}`);
                setSimilarProducts(response.data);
                console.log('Similar Products:', response.data);
            } catch (error) {
                console.error('Error fetching similar products:', error);
            }
        };

        if (productId && categoryId) {
            fetchProductDetails();
            fetchSimilarProducts();
        }
    }, [productId, categoryId]);


    const getContrastYIQ = (color) => {
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) return 'text-black'; // Default to black for invalid or empty colors
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? 'text-black' : 'text-white';
    };


    const userId = localStorage.getItem('userId')
    const userToken = localStorage.getItem('userToken');

    const addToCart = async () => {
        try {
            if (!selectedSize || !selectedSize[selectedColor]) {
                toast.error("Please select a size for the selected color.");
                return;
            }

            if (!userId && !userToken) {
                setModalTitle('You are not logged in');
                setModalDescription('To add items to your cart and complete your purchase, please log in or create an account.');
                setOpenUserNotLogin(true);
                return;
            }


            const payload = {
                userId: userId,
                productId: productDetails._id,
                quantity: 1, // Default quantity
                color: selectedColor,
                size: selectedSize[selectedColor],
            };

            console.log(payload);


            const response = await axios.post(`${BASE_URL}/user/cart/add`, payload, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                navigate('/user-cart')
                toast.success(`${productDetails.title} added to your cart`);
                setCart((prevCart) => {
                    const item = prevCart.find(
                        (item) =>
                            item.productId === payload.productId &&
                            item.color === payload.color &&
                            item.size === payload.size
                    );
                    if (item) {
                        item.quantity += 1;
                        return [...prevCart];
                    }
                    return [...prevCart, payload];
                });
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                setModalTitle('Session Expired');
                setModalDescription('Your session has expired. Please log in again to continue.');
                setOpenUserNotLogin(true);
            }

        }
    };


    const handleColorClick = (color) => {
        setSelectedColor((prevColor) => (prevColor === color ? "" : color));
    };



    // Handle size click for a specific color
    const handleSizeClick = (size, color) => {
        setSelectedSize((prevSelectedSize) => {
            const updatedSelectedSize = { ...prevSelectedSize };
            // If the size is already selected for the color, deselect it
            if (updatedSelectedSize[color] === size) {
                delete updatedSelectedSize[color];
            } else {
                updatedSelectedSize[color] = size; // Otherwise, select the new size for the color
            }
            return updatedSelectedSize;
        });
    };

    const handleWishlist = async (productId, productTitle) => {
        try {
            const payload = { userId: userId, productId: productId };

            const isInWishlist = favProduct?.items?.some(item => item.productId._id === productId);

            if (!isInWishlist) {
                const response = await axios.post(`${BASE_URL}/user/wishlist/add`, payload);
                console.log(response.data);

                setHeartIcons(prevState => ({
                    ...prevState,
                    [productId]: true,
                }));

                setFav((prevFav) => {
                    const isAlreadyFav = prevFav.some(
                        (item) => item.productId === payload.productId
                    );
                    return isAlreadyFav ? prevFav : [...prevFav, payload];
                });

                toast.success(`${productTitle} added to wishlist`);
            } else {
                toast.error('Product already in wishlist');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const colorSizes = productDetails.colors?.find(item => item.color === selectedColor)?.sizes || [];
    const colorColor = productDetails.colors || []
    const features = productDetails.features || []


    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/order/view/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });

                const orders = response.data.orders;
                const hasPurchased = orders.some(order =>
                    order.products.some(product =>
                        product.productId._id === productId && order.status === "Delivered"
                    )
                );

                setReviewEligible(hasPurchased);
            } catch (error) {
                console.error(error);
            }
        };

        if (userToken && userId) {
            fetchUserOrders();
        }
    }, [userToken, userId, productId]);

    const handleReviewClick = (e) => {
        if (!reviewEligible) {
            e.preventDefault();
            toast.error("You can only review products you have purchased and received.");
        }
    };



    return (
        <>
            <div className="p-4 xl:py-16 xl:px-32 lg:py-16 lg:px-32 bg-userBg h-[calc(100vh-4rem)] pb-20 overflow-y-auto">
                <h2 onClick={() => navigate(-1)} className='flex items-center gap-1 text-lg xl:text-xl lg:text-xl font-medium cursor-pointer'>
                    <IoIosArrowBack className="text-secondary text-2xl cursor-pointer" /> Back</h2>
                <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-5 xl:gap-10 lg:gap-10 mt-5">
                    <div className='col-span-2 xl:space-y-3 lg:space-y-3 xl:sticky xl:top-0 lg:sticky lg:top-0 h-[350px] xl:h-[600px] lg:h-[600px]'>
                        <div className='w-full h-full relative'>
                            <img
                                src={productDetails.images && productDetails.images.length > 0 ? productDetails.images[0] : '/no-image.jpg'}
                                alt={productDetails.title}
                                className='w-full h-full object-cover rounded-xl'
                            />

                            {heartIcons[productDetails._id] || favProduct?.items?.some(item => item.productId?._id === productDetails._id) ? (
                                <RiHeart3Fill
                                    onClick={() => handleWishlist(productDetails._id, productDetails.title)}
                                    className='absolute top-5 right-5 xl:text-3xl lg:text-3xl text-2xl cursor-pointer text-primary bg-white w-7 h-7 xl:w-8 xl:h-8 lg:w-8 lg:h-8 p-1 rounded-full shadow-md'
                                />
                            ) : (
                                <IoHeartOutline
                                    onClick={() => handleWishlist(productDetails._id, productDetails.title)}
                                    className='absolute top-5 right-5 xl:text-3xl lg:text-3xl text-2xl text-primary bg-white w-7 h-7 xl:w-8 xl:h-8 lg:w-8 lg:h-8 p-1 rounded-full shadow-md'
                                />
                            )}
                            {/* <div className='absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center items-center
                             bg-white shadow-md rounded-lg p-2 gap-x-2'>
                                <div className='w-12 h-12'>
                                    <img src="c1.jpg" alt="" className='w-full h-full object-cover rounded-md' />
                                </div>
                            </div> */}
                        </div>

                        <Button onClick={addToCart}
                            className='hidden xl:flex lg:flex items-center justify-center gap-2 font-normal capitalize font-custom tracking-wide text-sm
                        w-full bg-primary'>
                            <FiShoppingCart />Add to cart
                        </Button>
                    </div>
                    <div className='col-span-2'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-secondary capitalize font-semibold text-xl xl:text-2xl lg:text-2xl'>{productDetails.title}</h1>
                            <div className='flex items-center gap-3'>
                                <h2 className="flex items-center gap-1 text-sm xl:text-base lg:text-base">
                                    {averageRating.toFixed(1)}
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <FaStar
                                            key={index}
                                            className={index < Math.floor(averageRating) ? "text-ratingBg" : "text-gray-300"}
                                        />
                                    ))}
                                </h2>

                                <p className='text-xs xl:text-sm lg:text-sm'>({totalReviews})</p>
                            </div>
                        </div>
                        <p className='text-gray-600 text-xs capitalize xl:text-sm lg:text-sm mt-3'>{productDetails.description}</p>
                        <div>
                            <div className='flex items-center justify-between xl:justify-normal lg:justify-normal xl:gap-10 lg:gap-10 mt-2'>
                                <p className='text-xs xl:text-sm lg:text-sm font-semibold text-shippedBg'>Free Shipping</p>
                            </div>

                            <div className='mt-2'>
                                <ul className='flex items-center gap-3 xl:gap-4 lg:gap-4'>
                                    <li className='text-deleteBg font-medium text-2xl xl:text-base lg:text-base'>- {productDetails.discount}%</li>
                                    <li className='font-bold text-3xl xl:text-2xl lg:text-2xl'>₹{productDetails.offerPrice}</li>
                                </ul>
                                <p className="text-gray-600 font-normal text-sm xl:text-base lg:text-base">
                                    M.R.P : <s>{productDetails.actualPrice}</s>
                                </p>
                            </div>

                            {/* Select Color */}
                            <div className='mt-4'>
                                <h4 className='font-medium text-sm xl:text-base lg:text-base mb-2'>Select Color</h4>
                                <ul className='flex items-center gap-3'>
                                    {colorColor.map((color) => (
                                        <li
                                            key={color._id}
                                            onClick={() => handleColorClick(color.color)}
                                            className={`cursor-pointer text-3xl relative flex items-center justify-center ${selectedColor.includes(color.color) ? 'text-primary' : ''}`}
                                        >
                                            {selectedColor.includes(color.color) && (
                                                <TiTick className={`absolute text-3xl p-1 rounded-full bg-black/10 ${getContrastYIQ(color.color)}`} />
                                            )}
                                            <FaCircle style={{ color: color.color }} />
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Select Size */}
                            <div className='mt-4'>
                                <div className='flex items-center justify-between xl:justify-normal lg:justify-normal xl:gap-32 lg:gap-32 mb-2'>
                                    <h4 className='font-medium text-sm xl:text-base lg:text-base'>Select Size</h4>
                                    {/* <h4 onClick={handleOpenSizeDrawer} className='text-primary underline font-medium text-xs xl:text-sm lg:text-sm cursor-pointer'>Size chart</h4> */}
                                </div>
                                {/* Hint message */}
                                {!selectedColor && (
                                    <p className="text-xs text-gray-500 mb-3"><span className='text-primary'>*</span>
                                        Please select a color to see available sizes</p>
                                )}
                                <ul className='flex items-center gap-3'>
                                    {colorSizes.map((size) => (
                                        <li
                                            key={size._id}
                                            onClick={() => handleSizeClick(size.size, selectedColor)} // Pass color to handleSizeClick
                                            className={`bg-white cursor-pointer uppercase shadow-md rounded-md w-10 h-10 flex items-center justify-center text-sm xl:text-sm lg:text-sm 
                                                ${selectedSize[selectedColor] === size.size ? '!bg-primary text-white' : ''}`}>
                                            {size.size}
                                        </li>
                                    ))}
                                </ul>
                            </div>


                            {/* Specifications */}
                            <div className="mt-7">
                                <h4 className="font-medium mb-3 text-sm xl:text-base lg:text-base">Specifications</h4>
                                {
                                    Object.entries(features).map(([key, value], index) => (
                                        <div key={index} className="grid grid-cols-2 gap-x-4 mb-3">
                                            <span className="font-normal capitalize text-xs xl:text-sm lg:text-sm text-gray-600">{key}</span>
                                            <span className="text-left capitalize text-xs xl:text-sm lg:text-sm">{value || "null"}</span>
                                        </div>
                                    ))
                                }
                                {showMore && (
                                    <>
                                        <div className="grid grid-cols-2 gap-x-4 mb-3">
                                            <span className="font-normal capitalize text-xs xl:text-sm lg:text-sm text-gray-600">Manufacturer Name</span>
                                            <span className="text-left capitalize text-xs xl:text-sm lg:text-sm">{productDetails.manufacturerName}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 mb-3">
                                            <span className="font-normal capitalize text-xs xl:text-sm lg:text-sm text-gray-600">Manufacturer Brand</span>
                                            <span className="text-left capitalize text-xs xl:text-sm lg:text-sm">{productDetails.manufacturerBrand}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 mb-3">
                                            <span className="font-normal capitalize text-xs xl:text-sm lg:text-sm text-gray-600">Manufacturer Address</span>
                                            <span className="text-left capitalize text-xs xl:text-sm lg:text-sm">{productDetails.manufacturerAddress}</span>
                                        </div>
                                    </>
                                )}
                                <p
                                    className={`text-xs ${showMore ? 'text-buttonBg' : 'text-primary'} text-left font-semibold underline underline-offset-2 cursor-pointer mt-5`}
                                    onClick={toggleShowMore}
                                >
                                    {showMore ? 'See less' : 'See more'}
                                </p>
                            </div>


                            {/* Customer Reviews */}
                            {totalReviews === 0 ? (
                                <>
                                    <div className="mt-10">
                                        <h4 className="font-medium mb-3 text-sm xl:text-base lg:text-base pb-3 border-b-2 border-gray-300">
                                            Customer Reviews ({totalReviews})
                                        </h4>
                                        {totalReviews === 0 ? (
                                            <p className="text-gray-600 flex justify-center items-center py-5 text-sm">
                                                No reviews for this product
                                            </p>
                                        ) : null}

                                        <Link
                                            to={reviewEligible ? "/write-review" : "#"}
                                            state={{ productId }}
                                            onClick={handleReviewClick}
                                            className="flex items-center justify-center cursor-pointer"
                                        >
                                            <Button className="bg-primary font-normal capitalize font-custom py-2 px-4">
                                                Add Review
                                            </Button>
                                        </Link>
                                    </div>


                                </>
                            ) : (
                                <>
                                    <div className='mt-10'>
                                        <ProductReviews productId={productId} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* similar products */}
                <div className='mt-10 xl:mt-32 lg:mt-32'>
                    <SimilarProducts similarProducts={similarProducts} />
                </div>

                <div className="bg-white shadow-md fixed bottom-0 inset-x-0 z-50 w-full p-4 xl:hidden lg:hidden">
                    <Button onClick={addToCart} className='flex items-center justify-center gap-2 font-normal capitalize font-custom tracking-wide text-sm
                        w-full bg-primary'>
                        <FiShoppingCart />Add to cart
                    </Button>
                </div>
            </div>

            {/* size chart drawer */}
            {/* <SizeChart /> */}

            {/* popup for non-logged users */}
            <UserNotLoginPopup
                title={modalTitle}
                description={modalDescription}
            />

        </>
    )
}

export default ProductDetails