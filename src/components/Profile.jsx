import React, {useState, useEffect} from 'react'
import {Box, Avatar, AvatarBadge, Text, Heading, Stack, Button, useToast} from '@chakra-ui/react'
import {getAuth, signOut } from 'firebase/auth'
import { getFirestore, query, where, getDocs, collection } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { Link, useNavigate } from 'react-router-dom'
import { app } from '../../firebaseConfig'


const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState('')
  const [avatar, setAvatar] = useState('');
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const userRef = collection(db, 'user_data');
  const navigate = useNavigate();
  const toast = useToast();

  const signout = () => {
    signOut(auth).then(() => {
      navigate('/login');

      toast({
        title: "Logout Successful.",
        description: "You have been logged out successfully!.",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: 'left-accent',
        position: 'top-right',
      });

    })
  }
  
  const getCurrentUser = async () => {
    try {
      auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
        const q = query(userRef, where('user_id', '==', user.uid));
        const avatarRef = ref(storage, user.uid);

        if(user){
          getDownloadURL(avatarRef).then((url) => {
            setAvatar(url);
          });

          getDocs(q).then(async (snapshot) => {
            let user_data = [];
            snapshot.docs.map((item) => {
              user_data.push({ ...item.data(), id: item.id });
              console.log(user_data);
              return setUserDetails(user_data);
            })
          });
        }
      })
    } catch (error) {
      console.log(error.message);
    }
  };


  useEffect(() => {
    getCurrentUser()
  }, []);

  const newDate = currentUser?.metadata.creationTime
  const date = new Date(newDate).toDateString();

  return (
    <>
    {currentUser ? 
    <Box maxW='400px' mt='16' bg='gray.100' p='5' borderRadius={5} boxShadow='md' display='flex' alignItems='center' justifyContent='center' mx='auto'>
      <Box>
        <Heading mb='5'>My Profile</Heading>
        <Avatar bg='teal' size='xl' mb='5' display='block' mx='auto' src={avatar}>
          <AvatarBadge boxSize='0.7em' bg='green.500' />
        </Avatar>
        <Stack spacing={4} fontWeight='semibold'>
          <Text>Username: {userDetails[0]?.user_name}</Text>
          <Text>Bio: {userDetails[0]?.user_bio}</Text>
          <Text>Email: {currentUser?.email}</Text>
          <Text>Date Joined: {date}</Text>
        </Stack>
        <Box textAlign='center' mt='7'>
          <Button colorScheme='teal' onClick={signout}>Logout</Button>
        </Box>
      </Box>
    </Box> 
    : 
    <Box mx='auto' mt='16'>
      <Heading fontWeight='semibold' fontSize={25} mb='3'>OOPS!</Heading>
      <Text mb='3'>You are not authorised to view this page, please login to get acces</Text>
      <Link to='/login'>
            <Button>Login</Button>
      </Link>
    </Box>}
    </>
  )
}

export default Profile