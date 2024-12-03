import React from "react";
import {
    Navbar,
} from "@material-tailwind/react";
import Profile from "./Profile";
import { Notification } from "./Notification";
import { RiSearch2Line } from "react-icons/ri";



export function AppNavbar() {
    
    return (
        <>
            <div className='bg-white'>
                <Navbar className="mx-auto py-2 px-16 shadow-none rounded-none">
                    <div className='hidden lg:flex items-center justify-between'>
                        <ul className='w-[350px]'>
                            <li className='border-[1px] border-gray-300 py-1 px-2 flex items-center gap-1 rounded-full bg-quaternary w-full h-10'>
                                <RiSearch2Line className='text-gray-600 text-xl' />
                                <input type="search" name="search" id="" placeholder='Search' className='bg-transparent 
                                placeholder:text-gray-600 placeholder:text-base focus:outline-none text-secondary w-full'/>
                            </li>
                        </ul>
                        <ul className='flex items-center gap-10'>
                            <li className="relative text-secondary text-xl cursor-pointer">
                                <Notification />
                            </li>
                            <li><Profile /></li>
                        </ul>
                    </div>
                </Navbar>
            </div>
        </>
    );
}