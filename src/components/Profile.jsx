import React from 'react'
import {Box, VStack, Avatar, AvatarBadge, Text, Heading, Stack} from '@chakra-ui/react'


const Profile = () => {
  return (
    <Box maxW='400px' mt='16' bg='gray.100' p='5' borderRadius={5} boxShadow='md' display='flex' alignItems='center' justifyContent='center' mx='auto'>
      <Box>
        <Heading mb='5'>My Profile</Heading>
        <Avatar bg='teal' size='xl' mb='5' display='block' mx='auto'>
          <AvatarBadge boxSize='0.7em' bg='green.500' />
        </Avatar>
        <Stack spacing={4} fontWeight='semibold'>
          <Text>Username: </Text>
          <Text>Bio: </Text>
          <Text>Email: </Text>
          <Text>Status: </Text>
        </Stack>
      </Box>
    </Box>
  )
}

export default Profile