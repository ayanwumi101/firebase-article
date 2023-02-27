import React, {useState, useEffect} from 'react'
import {Box, VStack, Avatar, AvatarBadge, Text, Heading, Stack} from '@chakra-ui/react'
import {getAuth} from 'firebase/auth'
import { getFirestore, query, where, getDocs, collection } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { Link } from 'react-router-dom'
import { app } from '../../firebaseConfig'


const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState('')
  const [avatar, setAvatar] = useState('');
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const userRef = collection(db, 'user_data');
  
  // const getCurrentUser = async () => {
  //   await auth.onAuthStateChanged((user) => {
  //     setCurrentUser(user);
  //     const q = query(userRef, where('user_id', '==', user.uid));
  //     const avatarRef = ref(storage, user.uid);

  //     if (user) {
  //       getUserDetails(q);
  //       getDownloadURL(avatarRef).then((url) => {
  //         setAvatar(url);
  //       });
  //     }
  //   });
  // };

  // const getUserDetails = async (q) => {
  //   await getDocs(q).then(async (snapshot) => {
  //     let user_data = [];
  //     snapshot.docs.map((item) => {
  //       user_data.push({ ...item.data(), id: item.id });
  //       console.log(user_data);
  //       return setUserDetails(user_data);
  //     })
  //     console.log(userDetails);
  //   });
  // }

  const getCurrentUser = async () => {
    await auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      const q = user ? query(userRef, where('user_id', '==', user.uid)) : null;
      const avatarRef = user ? ref(storage, user.uid) : null;

      if (user) {
        getUserDetails(q);
        getDownloadURL(avatarRef).then((url) => {
          console.log(avatar);
          setAvatar(url);
        });
      }
    });
  };


  const getUserDetails = async (q) => {
    await getDocs(q).then(async (snapshot) => {
      let user_data = [];
      snapshot.docs.map((item) => {
        user_data.push({ ...item.data(), id: item.id });
        console.log(user_data);
        return setUserDetails(user_data);
      })
      console.log(userDetails);
    });
  }

  useEffect(() => {
    if(currentUser){
      getCurrentUser();
    }
  }, [currentUser]);

  console.log(userDetails);

  return (
    <Box maxW='400px' mt='16' bg='gray.100' p='5' borderRadius={5} boxShadow='md' display='flex' alignItems='center' justifyContent='center' mx='auto'>
      <Box>
        <Heading mb='5'>My Profile</Heading>
        <Avatar bg='teal' size='xl' mb='5' display='block' mx='auto'>
          <AvatarBadge boxSize='0.7em' bg='green.500' />
        </Avatar>
        <Stack spacing={4} fontWeight='semibold'>
          <Text>Username: {userDetails[0]?.user_name}</Text>
          <Text>Bio: {userDetails[0]?.user_bio}</Text>
          {/* <Text>Email: {user.email}</Text>
          <Text>Verification Status: {user.emailVerified}</Text> */}
        </Stack>
      </Box>
    </Box>
  )
}

export default Profile