import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
    carts: [
        // {
        //     quantity: 1, _id: 'abc', detail: {_id:'abc',}
        // }
    ]
};

export const orderSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCartAction: (state, action) => {
            let carts = state.carts;
            const item = action.payload;
            let foundCart = carts.findIndex(c => c._id === item._id);
            if (foundCart > -1) {
                carts[foundCart].quantity += item.quantity;
                if (carts[foundCart].quantity > item.detail.quantity) {
                    carts[foundCart].quantity = +item.detail.quantity;
                }
            } else {
                carts.push({
                    quantity: +item.quantity,
                    _id: item._id,
                    detail: item.detail
                });
            }
            state.carts = carts;
            message.success("Product is added to Cart");
        },
    },
    extraReducers: (builder) => {

    },
});

export const { addToCartAction } = orderSlice.actions;

export default orderSlice.reducer;
