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
            className='rounded-none'
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: 1 },
            }}>
            <DialogBody className='p-0 relative'>
                <HiOutlineXMark
                    onClick={handleOpen}
                    className='absolute z-50 top-2 right-2 cursor-pointer text-3xl bg-white rounded-full shadow-md p-1 text-primary' />
                {/* <Carousel
                    className="rounded-none"
                    prevArrow={({ handlePrev }) => (
                        <IconButton
                            variant="text"
                            color="black"
                            size="lg"
                            onClick={handlePrev}
                            className="!absolute top-2/4 left-4 -translate-y-2/4 bg-white opacity-50 rounded-full hover:bg-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                />
                            </svg>
                        </IconButton>
                    )}
                    nextArrow={({ handleNext }) => (
                        <IconButton
                            variant="text"
                            color="black"
                            size="lg"
                            onClick={handleNext}
                            className="!absolute top-2/4 !right-4 -translate-y-2/4 bg-white opacity-50 rounded-full hover:bg-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </IconButton>
                    )}> */}
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
                {/* </Carousel> */}
            </DialogBody>
        </Dialog>
    );
}
