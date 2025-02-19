import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
} from "@material-tailwind/react";
import namer from 'color-namer'; // Import the color-namer library
import { HiOutlineXMark } from "react-icons/hi2";

export function ViewOrdersModal({ handleOpen, open, getUserOrders }) {

    const TABLE_HEAD = ["Product", "Title", "Color", "Size", "Price"];

    // Function to get the nearest named color
    const getNamedColor = (colorCode) => {
        try {
            const namedColors = namer(colorCode);
            return namedColors.pantone[0].name || "Unknown Color";
        } catch (error) {
            console.error("Invalid color code:", error);
            return "Invalid Color";
        }
    };

    return (
        <>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>
                    <div className="flex justify-end w-full">
                        <HiOutlineXMark className='text-2xl cursor-pointer' onClick={handleOpen} />
                    </div>
                </DialogHeader>
                <DialogBody>
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none font-custom"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(getUserOrders) && getUserOrders.map((userOrder, index) => {
                                const isLast = index === getUserOrders.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={userOrder._id}>
                                        <td className={classes}>
                                            <div className='w-24 h-24'>
                                                <img
                                                    src={userOrder?.images[0] || "/path/to/default-image.jpg"} // Use a default image if undefined
                                                    alt="Product Image"
                                                    className='w-full h-full object-cover rounded-xl' />
                                            </div>
                                        </td>

                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal capitalize font-custom"
                                            >
                                                {userOrder.productId?.title}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal capitalize font-custom"
                                            >
                                                {userOrder.productId?.colors && userOrder.productId?.colors.length > 0
                                                    ? getNamedColor(userOrder.productId?.colors[0]?.color)
                                                    : "No Color Available"
                                                }
                                            </Typography>
                                        </td>

                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal uppercase font-custom"
                                            >
                                                {userOrder?.size}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal capitalize font-custom"
                                            >
                                                {userOrder.productId?.offerPrice}
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </DialogBody>
            </Dialog>
        </>
    );
}