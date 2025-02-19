import React from "react";
import {
    Carousel,
    Dialog,
    DialogBody,
    IconButton,
} from "@material-tailwind/react";
import { HiOutlineXMark } from "react-icons/hi2";

export function ImageZoomModal({ handleOpen, open, zoomImage }) {
    const { images, currentIndex } = zoomImage || {};
    return (
        <Dialog
            open={open}
            handler={handleOpen}
            size='xs'
            className='rounded-none focus:outline-none'
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: 1 },
            }}>
            <DialogBody className='p-0 relative'>
                <HiOutlineXMark
                    onClick={handleOpen}
                    className='absolute z-50 top-2 right-2 cursor-pointer text-3xl bg-white rounded-full shadow-md p-1 text-primary' />
                <div className='w-full h-96 flex items-center justify-center'>
                    {images && images.length > 0 ? (
                        <img
                            src={images[currentIndex]}
                            alt='Zoomed Product'
                            className='w-full h-full object-cover'
                        />
                    ) : (
                        <p className='text-gray-500'>No image available</p>
                    )}
                </div>
            </DialogBody>
        </Dialog>
    );
}
