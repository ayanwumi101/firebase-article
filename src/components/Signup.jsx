import React, {useState} from 'react'
import { app } from '../../firebaseConfig'
import {LoginCurve} from 'iconsax-react'
import {Box, FormControl, FormLabel, Button, Heading, Text, VStack, Input, useToast} from '@chakra-ui/react'
import {getAuth, createUserWithEmailAndPassword, signOut} from 'firebase/auth'
import {addDoc, getFirestore, collection} from 'firebase/firestore'
import {getStorage, ref, uploadBytes, } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'


const Signup = () => {

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //initialise navigate from react router dom
  const navigate = useNavigate();

  //initalise toast from chakra ui
  const toast = useToast();

  //intialise firebase auth
  const auth = getAuth();

  //initialise firebase firesore database
  const db = getFirestore();

  //initialise firebase storage
  const storage = getStorage();

  const handleSubmit = async() => {
    if(username && bio && avatar && email && password){
      //create use with email and password
      try {

        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        //upload the user avatar to firebase storage 
        const avatarRef = ref(storage, cred.user.uid);
        await uploadBytes(avatarRef, avatar).then(() => {
          console.log('avatar uploaded');
        });

        //collection reference
        const colref = collection(db, 'user_data');
        //add user's details as a document to the user_data collection
        await addDoc(colref, {
          user_name: username,
          user_id: cred.user.uid,
        }).then(() => {

          //set the inputs back to empty fields after the form has been submitted  
          // then redirects the user to the login page
          setUsername('');
          setEmail('');
          setPassword('');
          setBio('');
          navigate("/login");
          signOut(auth);
          console.log("user signed out");
        });

        //show success toast if account creation was successful
        toast({
          title: "Account created.",
          description: "Account created successfully!.",
          status: "success",
          duration: 3000,
          isClosable: true,
          variant: 'top-accent',
          position: 'top-right',

        });

      } catch (error) {
        // Handle any errors that occur during the function calls
        toast({
          title: "Error!",
          description: error.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          variant: "top-accent",
          position: "top-right",
        });
      }
    } else {
      //show error toast if any of the fields is empty
      toast({
        title: "Error!",
        description: "Please fill all fields correctly",
        status: 'error',
        duration: 2000,
        isClosable: true,
        variant: "left-accent",
        position: "top",
      });
    }

  }

  return (
    <Box mt='4'>
      <VStack spacing={6}>

      <Heading>Signup</Heading>

      <Box maxW='400px'>
      <FormControl>
        <VStack spacing={4}>
          <Box>
            <FormLabel>Username</FormLabel>
            <Input type='text' placeholder='Input your username' fontSize='14px' w='400px' value={username} onChange={(e) => setUsername(e.target.value)} />
          </Box>

          <Box>
            <FormLabel>Bio</FormLabel>
            <Input type='text' placeholder='Input your bio' fontSize='14px' w='400px' value={bio} onChange={(e) => setBio(e.target.value)} />
          </Box>

          <Box>
            <FormLabel>Upload your avatar</FormLabel>
            <Input type='file' w='400px' onChange={(e) => setAvatar(e.target.files[0])} />
          </Box>

          <Box>
            <FormLabel>Email</FormLabel>
            <Input type='email' placeholder='Input your email' fontSize='14px' w='400px' value={email} onChange={(e) => setEmail(e.target.value)} />
          </Box>

          <Box>
            <FormLabel>Password</FormLabel>
            <Input type='password' placeholder='Input your password' fontSize='14px' w='400px' value={password} onChange={(e) => setPassword(e.target.value)} />
          </Box>

          <Box>
            <Button type='submit' w='400px' colorScheme='teal' onClick={handleSubmit}> Signup <LoginCurve style={{marginLeft: '5px'}} /> </Button>
          </Box>
        </VStack>
      </FormControl>
      </Box>
      </VStack>
    </Box>
  )
}

export default Signup