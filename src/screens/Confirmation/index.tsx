import React from "react";
import { useWindowDimensions, StatusBar } from "react-native";
import { RootStackParamList } from "../../@types/navigation";

import LogoSvg from "../../assets/logo_background_gray.svg";
import DoneSvg from "../../assets/done.svg";

import { Container, Content, Title, Message, Footer } from "./styles";
import { ConfirmButton } from "../../components/ConfirmButton";
import { useNavigation, useRoute } from "@react-navigation/core";

interface Params {
  title: string;
  message: string;
  nextScreen: keyof RootStackParamList;
}

export function Confirmation() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();

  const { title, message, nextScreen } = route.params as Params;

  function handleConfirm() {
    navigation.navigate(nextScreen);
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LogoSvg width={width} />
      <Content>
        <DoneSvg width={80} height={80} />
        <Title>{title}</Title>

        <Message>{message}</Message>
      </Content>

      <Footer>
        <ConfirmButton title="OK" onPress={handleConfirm} />
      </Footer>
    </Container>
  );
}
