import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { useState } from "react";
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
          )}....${accounts[0].substring(accounts[0].length - 4)}`; // Modify account format
          setAccount(shortenedAccount); // Update account information with the shortened account
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
      setAccount(""); // Reset account information
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNFTData = async () => {
    try {
      // Opensea 테스트넷 API를 호출하여 NFT 정보를 가져오는 로직을 구현합니다.
      // 필요한 API 엔드포인트에 GET 요청을 보내고, 데이터를 추출합니다.
      // 예를 들어, axios 등의 HTTP 클라이언트를 사용할 수 있습니다.
      const response = await axios.get(
        "https://testnets-api.opensea.io/api/v1/asset/0x2953399124F0cBB46d2CbACD8A89cF0599974963/77975109537087021555095730259159261573398929991320928148399609542411594760292"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("NFT 정보를 가져오는 중에 오류가 발생했습니다.", error);
      return null;
    }
  };

  const handleGetNFT = async () => {
    const nftInfo = await fetchNFTData();
    if (nftInfo) {
      setSrc(nftInfo.image); // 이미지 URL을 설정하여 화면에 출력
      // 기타 NFT 메타데이터 정보를 사용하여 필요한 정보를 가져와서 화면에 출력
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
            <Image src={src} alt="NFT" boxShadow="lg" borderRadius="xl" />
          ) : (
            <Box
              width={512}
              height={512}
              bgColor="gray.300"
              border="2px"
              borderRadius="xl"
            />
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
