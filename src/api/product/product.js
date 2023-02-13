import {ajax, Method, ReqContentType} from "@/api/request";

export const getProductList = data => ajax("/store-back/product/list", data);

export const getProductDetail = data => ajax("/store-back/product/detail", data);

export const addProduct = data => ajax("/store-back/product/add", data, Method.POST);

export const updateProductStatus = data => ajax("/store-back/product/update-status", data, Method.POST,ReqContentType.APPLICATION_FORM);

export const editProduct = data => ajax("/store-back/product/edit", data, Method.POST);

export const delProduct = data => ajax("/store-back/product/del", data, Method.POST);

export const getProductOrderList = data => ajax("/store-back/product-order/list", data);

export const getProductOrderDetail = data => ajax("/store-back/product-order/detail", data);

export const updateSendProductState = data => ajax("/store-back/product-order/send-product", data, Method.POST);
export const getProductCategories = () => ajax("/store-back/product/category/list");

export const getProductCategoryPageList = data => ajax("/store-back/product/category/pageList", data);

export const addProductCategory = data => ajax("/store-back/product/category/add", data, Method.POST);

export const editProductCategory = data => ajax("/store-back/product/category/edit", data, Method.POST);

export const delProductCategory = data => ajax("/store-back/product/category/del", data, Method.POST,ReqContentType.APPLICATION_FORM);

export const getOrderAftersalesList = data => ajax("/store-back/product-order-aftersales/list", data);

export const getOrderAftersalesDetail = data => ajax("/store-back/product-order-aftersales/detail", data);

export const agreeAftersales = data => ajax("/store-back/product-order-aftersales/agree-aftersales",data,Method.POST)

export const rejectAftersales = data => ajax("/store-back/product-order-aftersales/reject-aftersales",data,Method.POST)