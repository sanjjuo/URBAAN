import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardBody, CardFooter, Checkbox, Chip, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { AppContext } from '../../../../StoreContext/StoreContext';
import axios from 'axios';
import AppLoader from '../../../../Loader';
import toast from 'react-hot-toast';
import { OrderStatusModal } from './OrderStatusModal';

const TABLE_HEAD = ["ID", "Customer", "Address", "Delivery Date", "Product", "Size", "Payment", "Status"]; //action here 

const OrderTable = ({ orderList, setOrderList }) => {
  const { BASE_URL } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [openOrderStatus, setOpenOrderStatus] = useState(false);
  const [selectOrder, setSelectOrder] = useState([])
  const [editStatusBtn, setEditStatusBtn] = useState(false)


  const handleOpenOrderStatus = () => setOpenOrderStatus(!openOrderStatus);

  // Predefined allowed statuses
  const allowedStatuses = ["Delivered", "Processing", "Cancelled", "Pending"];

  // Status colors
  const statusColors = {
    Delivered: "text-shippedBg bg-shippedBg/20",
    Processing: "text-processingBg bg-processingBg/20",
    Cancelled: "text-cancelBg bg-cancelBg/20",
    Pending: "text-pendingBg bg-pendingBg/20",
    default: "text-gray-500 bg-gray-200",
  };

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/orderlist/get`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrderList(response.data);
        console.log(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching order list:", error);
      }
    };
    fetchOrderList();
  }, [BASE_URL]);


  // const handleStatusChange = async (statusId, newStatus) => {
  //   if (!allowedStatuses.includes(newStatus)) {
  //     alert(`Invalid status: ${newStatus}`);
  //     return;
  //   }

  //   try {
  //     const response = await axios.patch(`${BASE_URL}/admin/orderlist/${statusId}/status`, { status: newStatus });
  //     console.log("Status updated successfully:", response.data);
  //     toast.success("Status updated!")

  //     // Optimistically update the UI
  //     setOrderList((prevList) =>
  //       prevList.map((order) =>
  //         order._id === statusId ? { ...order, status: newStatus } : order
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error updating status:", error.response?.data?.message || error.message);
  //     alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
  //   }
  // };

  // Handle individual checkbox click
  const handleCheckboxClick = (orderId) => {
    setSelectOrder((prevSelected) => {
      if (prevSelected.includes(orderId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== orderId);
      } else {
        // If not selected, add to array
        return [...prevSelected, orderId];
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectOrder.length === orderList.length) {
      setSelectOrder([]);
    } else {
      const allOrderIds = orderList.map((order) => order._id);
      setSelectOrder(allOrderIds);
      console.log(allOrderIds);
    }
  };


  // Get current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrderList = (orderList || []).slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle next and prev page
  const handleNextPage = () => {
    if (currentPage < Math.ceil(orderList.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  // Add the new title conditionally when `editStatusBtn` is true
  const tableHead = editStatusBtn ? ["", ...TABLE_HEAD] : TABLE_HEAD;
  
  return (
    <>
      {isLoading || orderList.length === 0 ? (
        <div className="col-span-2 flex justify-center items-center h-[50vh]">
          <AppLoader />
        </div>
      ) : (
        <>
          <div className='relative'>
            {!editStatusBtn ? (
              <>
              </>
            ) : (
              <div className='flex items-center absolute left-0'>
                <Checkbox
                  checked={selectOrder.length === orderList.length}
                  onChange={handleSelectAll}
                />
                Select All
              </div>
            )}
            <div className='flex items-center justify-end'>
              <Button
                onClick={() => setEditStatusBtn(!editStatusBtn)}
                className='bg-buttonBg capitalize text-sm font-normal font-custom'>Edit Status</Button>
            </div>
          </div>

          <Card className="w-full shadow-sm rounded-xl bg-white border-[1px] mt-3">
            <CardBody>
              <table className="w-full table-auto text-left border-collapse">
                <thead>
                  <tr className='bg-quaternary'>
                    {tableHead.map((head) => (
                      <th key={head} className="border-b border-blue-gray-100 p-3 text-center w-[300px] whitespace-nowrap">
                        <Typography
                          variant="small"
                          className="font-semibold font-custom text-secondary leading-none text-base uppercase"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentOrderList.map((order, index) => {
                    const isLast = index === currentOrderList.length - 1;
                    const classes = isLast
                      ? "p-4 text-center"
                      : "p-4 border-b border-gray-300 text-center";

                    return (
                      <tr key={order._id}>
                        {!editStatusBtn ? (
                          <></>
                        ) : (
                          <>
                            <td className={classes}>
                              <Checkbox
                                checked={selectOrder.includes(order._id)}
                                onChange={() => handleCheckboxClick(order._id)}
                              />
                            </td>
                          </>
                        )}
                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm">
                            {order?.orderId}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm capitalize">
                            {order.userId?.name || ""}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm capitalize">
                            {order?.addressId?.address}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm capitalize">
                            {order.products?.[0]?.productId?.title || "N/A"}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm capitalize">
                            {order.products?.[0]?.size || "N/A"}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm capitalize">
                            {order.paymentMethod}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Chip
                            className={`capitalize text-sm text-center font-normal ${statusColors[order.status] || statusColors.default}`}
                            value={order.status}
                          />
                        </td>
                        {/* <td className={classes}>
                          <Menu placement="bottom-end" className="outline-none">
                            <MenuHandler>
                              <IconButton variant="text">
                                <HiOutlineDotsHorizontal className="text-primary text-2xl cursor-pointer" />
                              </IconButton>
                            </MenuHandler>
                            <MenuList>
                              {allowedStatuses.map((status, index) => (
                                <MenuItem
                                  key={index}
                                  onClick={() => handleStatusChange(order._id, status)}
                                  className={`font-custom capitalize ${statusColors[status]?.split(" ")[0]} hover:!text-buttonBg`}
                                >
                                  {status}
                                </MenuItem>
                              ))}
                            </MenuList>
                          </Menu>
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>

            {!editStatusBtn ? (
              <></>
            ) : (
              <div className='flex items-center justify-center'>
                <Button onClick={handleOpenOrderStatus} className='bg-buttonBg font-custom capitalize font-normal text-sm'>Change Status</Button>
              </div>
            )}

            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4 mt-10">
              <Button
                variant="outlined"
                size="sm"
                className='font-custom border-gray-300 font-normal capitalize text-sm cursor-pointer hover:bg-black hover:text-white'
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Prev. page
              </Button>

              <div className="flex items-center gap-2">
                {[...Array(Math.ceil(orderList.length / itemsPerPage))].map((_, index) => (
                  <IconButton key={index} variant="text" size="sm" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </IconButton>
                ))}
              </div>

              <Button
                variant="outlined"
                size="sm"
                className='font-custom border-gray-300 font-normal capitalize text-sm cursor-pointer hover:bg-black hover:text-white'
                onClick={handleNextPage}
                disabled={currentPage === Math.ceil(orderList.length / itemsPerPage)}
              >
                Next page
              </Button>
            </CardFooter>
          </Card>
        </>
      )}

      <OrderStatusModal
        open={openOrderStatus}
        handleOpen={handleOpenOrderStatus}
        selectOrder={selectOrder}
        setOrderList={setOrderList}
        orderList={orderList}
        setSelectOrder={setSelectOrder}
      />
    </>
  );
};

export default OrderTable;
