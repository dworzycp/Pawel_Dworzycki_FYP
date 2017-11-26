export class GoogleLocationModel {
    results: ResultModel[];
}

class ResultModel {
    address_components: AddressComponentModel[];
    formatted_address: string;
}

class AddressComponentModel {
    long_name: string;
    short_name: string;
    types: string[];
}