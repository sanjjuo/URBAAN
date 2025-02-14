import React from "react";
import {
    Dialog,
    DialogBody,
} from "@material-tailwind/react";
import { HiOutlineXMark } from "react-icons/hi2";

export function ImageZoomModal({ handleOpen, open, zoomImage }) {
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
            <DialogBody className='p-0'>
                <div className='w-full h-96 relative'>
                    <HiOutlineXMark 
                    onClick={handleOpen}
                    className='absolute top-2 right-2 cursor-pointer text-3xl bg-white rounded-full shadow-md p-1 text-primary'/>
                    {/* Check if zoomImage and images[0] exist */}
                    {zoomImage?.images && zoomImage.images[0] ? (
                        <img src={zoomImage.images[0]} alt="Zoomed Image" className='w-full h-full object-cover' />
                    ) : (
                        <p>No image available</p> // Fallback if image is not available
                    )}
                </div>
            </DialogBody>
        </Dialog>
    );
}
