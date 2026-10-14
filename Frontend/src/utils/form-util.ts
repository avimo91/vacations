import { ProductModel } from "../models/data-model";

class FormUtil {

    // Convert product into FormData, so we could send also the image:
    public toFormData(product: ProductModel): FormData {
        const productFormData = new FormData();
        productFormData.append("name", product.name);
        productFormData.append("price", product.price.toString());
        productFormData.append("stock", product.stock.toString());
        productFormData.append("image", product.image);
        return productFormData;
    }

}

export const formUtil = new FormUtil();
