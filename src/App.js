import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import axios from "axios";

const theme = extendTheme({
  colors: {
    lime: {
      50: "#f2fdf1",
      100: "#daf7d6",
      200: "#b2edac",
      300: "#89e284",
      400: "#5fdc5b",
      500: "#35d433",
      600: "#2bad28",
      700: "#207d1e",
      800: "#155217",
      900: "#0a280d",
    },
  },
});

const App = () => {
  const [account, setAccount] = useState("");
  const [src, setSrc] = useState("");

  useEffect(() => {
    // Check if the user is already connected
    const checkAccount = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        const accounts = [window.ethereum.selectedAddress];
        if (accounts.length > 0) {
          const shortenedAccount = `${accounts[0].substring(
            0,
            4
          )}....${accounts[0].substring(accounts[0].length - 4)}`;
          setAccount(shortenedAccount);
        } else {
          setAccount("");
        }
      }
    };
    checkAccount();
  }, []);

  // 계정 반환 함수
  const getAccount = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          const shortenedAccount = `${accounts[0].substring(
            0,
            4
          )}....${accounts[0].substring(accounts[0].length - 4)}`;
          setAccount(shortenedAccount);

          // Check the last 4 characters of the first account
          const lastFourDigits = accounts[0].slice(-4);
          switch (lastFourDigits) {
            case "bec2":
              setSrc("../image/01.png");
              break;
            case "56a9":
              setSrc("../image/02.png");
              break;
            case "2268":
              setSrc("../image/03.png");
              break;
            case "0241":
              setSrc("../image/04.png");
              break;
            default:
              setSrc("");
              break;
          }
        } else {
          setAccount("");
        }
      } else {
        alert("Install MetaMask!!!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async () => {
    try {
      setAccount("");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNFTData = async () => {
    try {
      const response = await axios.get(
        "https://testnets-api.opensea.io/api/v1/asset/0x2953399124F0cBB46d2CbACD8A89cF0599974963/77975109537087021555095730259159261573398929991320928148399609542411594760292"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("An error occurred while fetching NFT data.", error);
      return null;
    }
  };

  const handleGetNFT = async () => {
    const nftInfo = await fetchNFTData();
    if (nftInfo) {
      setSrc(nftInfo.image);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Box
          position="absolute"
          width="100%"
          bgColor="purple.500"
          px={4}
          py={8}
          textAlign="center"
        >
          {account ? (
            <Flex alignItems="center" justifyContent="center">
              <Text fontWeight="bold" color="white" mr={4}>
                Hello, {account}
              </Text>
              <Button colorScheme="lime" onClick={logOut}>
                Log Out
              </Button>
            </Flex>
          ) : (
            <Button colorScheme="lime" onClick={getAccount}>
              Connect with MetaMask
            </Button>
          )}
        </Box>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minH="100vh"
          bg="gray.100"
        >
          {src ? (
            <Box
              width={512}
              height={512}
              bgColor="gray.300"
              border="2px"
              borderRadius="xl"
            />
          ) : (
            <Box
              width={512}
              height={512}
              bgColor="gray.300"
              border="2px"
              borderRadius="xl"
            >
              {src && (
                <Image
                  src={src}
                  alt="NFT Image"
                  width="100%"
                  height="100%"
                  objectFit="contain"
                />
              )}
            </Box>
          )}
          <br />
          <Button colorScheme="yellow" onClick={handleGetNFT}>
            Get NFT
          </Button>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default App;
