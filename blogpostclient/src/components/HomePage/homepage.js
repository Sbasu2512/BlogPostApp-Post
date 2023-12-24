import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import RegisterForm from "../RegisterForm/registerform";
import LoginForm from "../LoginForm/LoginForm";
import Footer from "../Footer/Footer";
import { useDispatch } from "react-redux";
import {addUserDetailsAction} from '../../Actions/userAction';
import axios from "axios";
import env from "react-dotenv";
import { addAllPostsAction, addUserPostsAction } from "../../Actions/postAction";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const HomePage = () => {

  const [selectedIndex, setSelectedIndex] = useState(1);
  const [pullPosts, setPullPosts] = useState(false);
  const [userId, setUserId] = useState("");
  
  
  const dispatch = useDispatch();
  
  const pulldata = (data) => {
    let isSuccess = false;
    isSuccess = data.status;
    if(isSuccess){    
      //store user details
      const userDetails = {
        description: data.message.description,
        displayName: data.message.displayName,
        email: data.message.email,
        profileId: data.message.profileId,
        userId: data.message.userId
      };
      // dispatch(addUserDetailsAction(userDetails));
      dispatch(addUserDetailsAction(userDetails));
      setUserId(data.message.userId);
      setPullPosts(true);
      setSelectedIndex(1);
    }else{
      toast.error(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    }
  };

  useEffect(()=>{
    if(pullPosts && userId){

      axios.all(
        [axios.get(`${env.REACT_APP_Posts_API}/postsAll`),
        axios.get(`${env.REACT_APP_Posts_API}/posts/${userId}`)]
      ).then((axios.spread((allPosts,userPosts)=>{
        //save all posts to store
        console.log(allPosts);
        dispatch(addAllPostsAction(allPosts.data.result));
        //save user posts to store with user_id
        const userPostObj = {
          user_id:userId,
          user_posts:userPosts.data.result
        }
        dispatch(addUserPostsAction(userPostObj));
      })))

    }

    return () => {
      setUserId("");
      setPullPosts(false);
    }
  },[pullPosts])


  return (<>
  <ToastContainer />
    <div className="container flex flex-col space-y-4 justify-center content-center justify-items-center	">
      <div className="h-16 bg-orange-500 text-white">
        <p className="font-sans text-2xl font-bold mt-3">BlogApp</p>
      </div>
      <div className="w-9/12 h-2/4 mx-40 ">
          <div className="w-full max-w-md px-2 py-16 sm:px-0 h-1/4 mx-96">
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 w-30">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                      "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                      selected
                        ? "bg-white text-blue-700 shadow"
                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                    )
                  }
                >
                  Register
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                      "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                      selected
                        ? "bg-white text-blue-700 shadow"
                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                    )
                  }
                >
                  Login
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel
                  className={classNames(
                    "rounded-xl bg-white p-3",
                    "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                  )}
                >
                  <RegisterForm func={pulldata} />
                </Tab.Panel>
                <Tab.Panel
                  className={classNames(
                    "rounded-xl bg-white p-3",
                    "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                  )}
                >
                  <LoginForm func={pulldata} />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
      </div>
      <div className="absolute bottom-0 w-full">
      <Footer/>
      </div>
    </div>
  </>)
};

export default HomePage;
