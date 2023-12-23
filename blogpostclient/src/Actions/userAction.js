import { addUserDetails, deleteUserDetails, changeUserDetails } from "../Redux/User/actionTypes";


const addUserDetailsAction = (data) => {
    return{
        type: addUserDetails,
        payload:data
    }
}

const updateUserDetailsAction = () => {
    return{
        type: changeUserDetails
    }
}

const deleteUserDetailsAction = () => {
    return{
        type: deleteUserDetails
    }
}

export { addUserDetailsAction, updateUserDetailsAction, deleteUserDetailsAction}