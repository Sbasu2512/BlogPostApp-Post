
export default class ResponseDto{

    result ;
    message;

    get result(){
        return this.result;
    }

    get message(){
        return this.message;
    }

    set result(result){
        this.result = result;
    }

    set message(msg){
        this.message = this.message;
    }
}