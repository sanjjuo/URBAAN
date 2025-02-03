import React from "react";
import {
    Button,
    Dialog,
    DialogBody,
    Typography,
} from "@material-tailwind/react";
import { useContext } from "react";
import { AppContext } from "../../../StoreContext/StoreContext";
import { Link } from "react-router-dom";

export function UserNotLoginPopup({ title, description }) {
    const { handleOpenUserNotLogin, openUserNotLogin } = useContext(AppContext);

    return (
        <>
            <Dialog open={openUserNotLogin} 
            // handler={handleOpenUserNotLogin} 
            size="xs" className="rounded-none">
                <DialogBody className="flex flex-col justify-center items-center p-5 space-y-5">
                    <Typography className="font-custom text-2xl text-secondary font-semibold">
                        {title}
                    </Typography>
                    <Typography className="font-custom text-base text-gray-500 font-light text-center">
                        {description}
                    </Typography>
                    <Link 
                        to="/login-user" 
                        className="focus:outline-none"
                        onClick={() => console.log("Login link clicked")}
                    >
                        <Button
                            onClick={handleOpenUserNotLogin}
                            className="w-32 bg-primary text-sm capitalize font-normal"
                        >
                            <span>Log in</span>
                        </Button>
                    </Link>
                </DialogBody>
            </Dialog>
        </>
    );
}
