import { Button, Typography } from '@material-tailwind/react'
import React from 'react'
import { TiEdit } from "react-icons/ti";
import { RiAccountBoxLine } from "react-icons/ri";
import { TbAddressBook } from "react-icons/tb";
import { LiaClipboardListSolid } from "react-icons/lia";
import { RiHeart3Line } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { RiLogoutCircleRFill } from "react-icons/ri";

const UserProfile = () => {
  return (
    <>
      <div className="p-4 xl:py-16 xl:px-32 lg:py-16 lg:px-32 bg-userBg h-screen">
        <div className='flex flex-col justify-center items-center gap-2'>
          <div className='w-20 h-20'>
            <img src="/userProfile.jpg" alt="" className='w-full h-full object-cover rounded-3xl' />
          </div>
          <Typography className='font-custom font-medium text-sm xl:text-base lg:text-base flex items-center gap-1'>
            <TiEdit className='text-primary' />Natalie Portman</Typography>
        </div>

        <div className='mt-10'>
          <ul className='space-y-4'>
            <li className='flex items-center justify-between'>
              <span className='flex items-center gap-2 text-sm'><RiAccountBoxLine />Account Details</span>
              <span className='text-sm xl:text-base lg:text-base bg-white rounded-full shadow-md w-5 h-5 flex items-center justify-center'>
                <IoIosArrowForward /></span>
            </li>
            <li className='flex items-center justify-between'>
              <span className='flex items-center gap-2 text-sm'><TbAddressBook />Address</span>
              <span className='text-sm xl:text-base lg:text-base bg-white rounded-full shadow-md w-5 h-5 flex items-center justify-center'>
                <IoIosArrowForward /></span>
            </li>
            <li className='flex items-center justify-between'>
              <span className='flex items-center gap-2 text-sm'><LiaClipboardListSolid />Orders</span>
              <span className='text-sm xl:text-base lg:text-base bg-white rounded-full shadow-md w-5 h-5 flex items-center justify-center'>
                <IoIosArrowForward /></span>
            </li>
            <li className='flex items-center justify-between'>
              <span className='flex items-center gap-2 text-sm'><RiHeart3Line />Wishlist</span>
              <span className='text-sm xl:text-base lg:text-base bg-white rounded-full shadow-md w-5 h-5 flex items-center justify-center'>
                <IoIosArrowForward /></span>
            </li>
          </ul>
        </div>

        <div className='flex items-center justify-center mt-5'>
          <Button variant='outlined' className='flex items-center gap-1 w-32 rounded-3xl text-sm font-custom capitalize font-normal text-primary border-primary
            bg-white hover:bg-primary hover:text-white hover:opacity-100 py-2'>
            <RiLogoutCircleRFill className='text-lg'/>Logout</Button>
        </div>
      </div>
    </>
  )
}

export default UserProfile