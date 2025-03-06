import { Button } from '@material-tailwind/react';
import React, { useContext, useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../StoreContext/StoreContext';
import axios from 'axios';
import AppLoader from '../../../Loader';
import toast from 'react-hot-toast';
import { HiOutlineXMark } from 'react-icons/hi2';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { MdZoomOutMap } from 'react-icons/md';
import { ImageZoomModal } from '../ImageZoomModal/ImageZoomModal';

const UserWishlist = () => {
    const navigate = useNavigate();
    const { BASE_URL, setFav } = useContext(AppContext);
    const [wishlist, setWishlist] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const wishlistProducts = wishlist?.items || [];
    const [zoomImage, setZoomImage] = useState(null);
    const [openImageModal, setOpenImageModal] = React.useState(false);


    const userId = localStorage.getItem('userId');

    //handle image zoom
    const handleOpenImageZoom = (productImages, index) => {
        setOpenImageModal(!openImageModal);
        setZoomImage({ images: productImages, currentIndex: index });
    }

    // Fetch wishlist products
    useEffect(() => {
        const fetchWishlistProducts = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`${BASE_URL}/user/wishlist/view/${userId}`);
                    setWishlist(response.data || {});
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWishlistProducts();
    }, []);

    // Delete wishlist product
    const handleWishlistDelete = async (productId) => {
        try {
            const userId = localStorage.getItem('userId');
            const payload = { userId, productId };

            const response = await axios.delete(`${BASE_URL}/user/wishlist/remove`, {
                data: payload,
            });

            if (response.status === 200) {
                setWishlist((prev) => {
                    const updatedItems = prev.items.filter((item) => item.productId._id !== productId);
                    setFav((prevFav) => prevFav.filter((item) => item.productId._id !== productId));  // Update fav.length
                    return { ...prev, items: updatedItems };
                });
                toast.success('Product removed from wishlist');
            }
        } catch (error) {
            console.error('Error deleting wishlist item:', error);
            toast.error('Failed to remove product');
        }
    };

    // handle clear
    const handleWishlistClear = async () => {
        try {
            const userId = localStorage.getItem('userId')
            const response = await axios.delete(`${BASE_URL}/user/wishlist/clear/${userId}`)
            console.log(response.data);
            setWishlist((prev) => {
                const updatedWishlist = { ...prev, items: [] };  // Clear wishlist items
                setFav([]);  // Clear favorites as well
                return updatedWishlist;
            });
            toast.success('Wishlist is cleared')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div>
                <p onClick={handleWishlistClear} className='!mt-0 capitalize flex justify-end items-center gap-0 text-sm hover:text-primary cursor-pointer'>
                    clear all <HiOutlineXMark className='text-lg' /></p>

                {isLoading ? (
                    <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                        <AppLoader />
                    </div>
                ) : wishlistProducts.length === 0 ? (
                    <div className='flex flex-col justify-center items-center !mt-0 mb-20'>
                        <div className='w-64 h-64 xl:w-72 xl:h-72 lg:w-72 lg:h-72'>
                            <img src="/favourite.png" alt="Empty Wishlist" className='w-full h-full object-cover' />
                        </div>
                        <div className='space-y-3 flex flex-col justify-center items-center'>
                            <h1 className='text-2xl font-semibold'>Your wishlist is Empty</h1>
                            <p className='text-center text-gray-600'>
                                You can add an item to your favourites by clicking “Heart Icon”
                            </p>
                            <Link to='/'>
                                <Button className='bg-primary text-sm capitalize w-48 font-custom font-normal'>
                                    Go Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 gap-x-5 gap-y-10 !mt-16'>
                        {wishlistProducts.map((product) => (
                            <div key={product._id} className='relative'>
                                <RiDeleteBin5Line
                                    onClick={() => handleWishlistDelete(product.productId._id)}
                                    className='text-deleteBg absolute -top-5 right-1 cursor-pointer'
                                />
                                <Link
                                    to="/product-details"
                                    state={{
                                        productId: product?._id,
                                        categoryId: product?.category?._id
                                    }}
                                    className="group"
                                >
                                    <div className='w-full h-52 xl:h-80 lg:h-80 rounded-xl overflow-hidden'>
                                        <img
                                            src={product?.productId?.images[0]}
                                            alt={product.productId.title}
                                            className='w-full h-full object-cover rounded-xl shadow-md
                                        transition-transform scale-100 duration-500 ease-in-out group-hover:scale-105'
                                            onError={(e) => e.target.src = '/no-image.jpg'}
                                        />
                                    </div>
                                </Link>
                                <MdZoomOutMap
                                    onClick={() => handleOpenImageZoom(product?.productId?.images, 0)}
                                    className='absolute top-2 left-2 cursor-pointer text-gray-600 bg-white w-7 h-7 xl:w-8 xl:h-8 lg:w-8 lg:h-8 p-1 rounded-full shadow-md'
                                />
                                <div className='mt-3'>
                                    <h4 className='font-medium text-sm xl:text-lg lg:text-lg capitalize truncate w-40 xl:w-60 lg:w-60'>
                                        {product.productId.title}
                                    </h4>
                                    <p className="text-gray-600 text-xs xl:text-sm truncate w-40 xl:w-60 lg:w-60">
                                        {product.productId.description}
                                    </p>
                                    <p className='text-primary text-base xl:text-xl lg:text-xl font-semibold mt-2'>
                                        ₹{product.productId.offerPrice}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ImageZoomModal
                open={openImageModal}
                handleOpen={handleOpenImageZoom}
                zoomImage={zoomImage}
            />
        </>
    )
}

export default UserWishlist
