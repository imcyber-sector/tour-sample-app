import { ProductDetailStore, ProductListStore } from "./stores/productStore";

export class ApiCalls {
    getQuery(url:string, param?:string) {
        let newUrl = param ? `${url}/${param}` : url;
        fetch(newUrl)
            .then(response => response.json())
            .then(data => {
                // updating store
                (param) 
                    ?   ProductDetailStore.set(data)
                    :   ProductListStore.set(data);
            }).catch(error => {
                // handling errors : showing toaster msg or logging it
                console.log("error", error);
                
            })
    }
}