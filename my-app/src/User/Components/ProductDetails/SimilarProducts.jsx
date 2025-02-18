import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../../StoreContext/StoreContext'
import { RiHeart3Fill, RiHeart3Line } from 'react-icons/ri'
import { UserNotLoginPopup } from '../UserNotLogin/UserNotLoginPopup'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { MdZoomOutMap } from 'react-icons/md'
import { ImageZoomModal } from '../ImageZoomModal/ImageZoomModal'

const SimilarProducts = ({ similarProducts }) => {
    const { BASE_URL, favProduct, setOpenUserNotLogin, setFav } = useContext(AppContext)
    const [heartIcons, setHeartIcons] = useState({});
    const [openImageModal, setOpenImageModal] = React.useState(false);
    const [zoomImage, setZoomImage] = useState(null)

    //handle image zoom
    const handleOpenImageZoom = (productImages, index) => {
        setOpenImageModal(!openImageModal);
        setZoomImage({ images: productImages, currentIndex: index });
    }

    console.log(similarProducts);


    const handleWishlist = async (productId, productTitle) => {
        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                setOpenUserNotLogin(true);
                return;
            }

            const payload = {
                userId: userId,
                productId: productId
            };

            const isInWishlist = favProduct?.items?.some(item => item.productId?._id === productId);

            if (isInWishlist) {
                toast.error(`${productTitle} is already in your wishlist`);
                return;
            }

            const response = await axios.post(`${BASE_URL}/user/wishlist/add`, payload);
            console.log(response.data);

            setHeartIcons(prevState => ({
                ...prevState,
                [productId]: !isInWishlist,
            }));

            setFav((prevFav) => {
                const isAlreadyFav = prevFav.some(
                    (item) => item.productId === payload.productId
                );
                return isAlreadyFav ? prevFav : [...prevFav, payload];
            });

            toast.success(`${productTitle} added to wishlist`);

        } catch (error) {
            if (error.response && error.response.data.message === "Product is already in the wishlist") {
                toast.error(`${productTitle} is already in your wishlist`);
            } else {
                console.log("Error adding to wishlist:", error);
                toast.error("Failed to add product to wishlist");
            }
        }
    };


    return (
        <>
            <h1 className='text-secondary text-lg xl:text-2xl lg:text-2xl font-semibold text-center mb-10'>Similar Products</h1>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-5 gap-5 pb-10'>
                {similarProducts.map(product => {
                    const isInWishlist = favProduct?.items?.some(item => item?.productId?._id === product._id);
                    return (
                        <div className='group relative' key={product._id}>
                            <Link
                                to="/product-details"
                                state={{
                                    productId: product._id,
                                    categoryId: product.category // Pass the category ID
                                }}
                                className="cursor-pointer"
                            // onClick={handleClick}
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

            <UserNotLoginPopup
                title='You are not logged in'
                description='Please log in or create an account to add items to your wishlist and keep track of your favorites.'
            />

            <ImageZoomModal
                open={openImageModal}
                handleOpen={handleOpenImageZoom}
                zoomImage={zoomImage}
            />
        </>
    )
}

export default SimilarProducts