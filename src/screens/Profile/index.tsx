import React, { useState } from "react";
import { useAuth } from "../../hooks/auth";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as yup from "yup";

import { BackButton } from "../../components/BackButton";
import { Input } from "../../components/Input";
import { InputPassword } from "../../components/InputPassword";
import { Button } from "../../components/Button";

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  LogoutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
  Section,
} from "./styles";
import { useNetInfo } from "@react-native-community/netinfo";

export function Profile() {
  const { user, signOut, updateUser } = useAuth();
  const netInfo = useNetInfo();

  const [option, setOption] = useState<"dataEdit" | "passwordEdit">("dataEdit");
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [driver_license, setDriverLicense] = useState(user.driver_license);

  const theme = useTheme();
  const navigation = useNavigation();

  function handleBack() {
    navigation.goBack();
  }

  async function handleSelectAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (result.cancelled) {
      return;
    }

    if (result.uri) {
      setAvatar(result.uri);
    }
  }

  async function handleProfileUpdate() {
    try {
      const schema = yup.object().shape({
        driver_license: yup.string().required("CNH é obrigatória"),
        name: yup.string().required("Nome é obrigatório"),
      });

      const data = { name, driver_license };
      await schema.validate(data);

      await updateUser({
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        name,
        driver_license,
        avatar,
        token: user.token,
      });

      Alert.alert("Perfil atualizado!");
    } catch (error) {
      console.log(error);
      if (error instanceof yup.ValidationError) {
        Alert.alert("Opa", error.message);
      } else {
        Alert.alert("Não foi possível atualizar o perfil");
      }
    }
  }

  function handleOptionChange(optionSelected: "dataEdit" | "passwordEdit") {
    if (!netInfo.isConnected === true && optionSelected === "passwordEdit") {
      Alert.alert(
        "Você está Offline",
        "Para mudar a senha, conecte-se a Internet"
      );
    } else {
      setOption(optionSelected);
    }
  }

  async function handleSignOut() {
    Alert.alert(
      "Tem certeza?",
      "Se você sair, irá precisar de internet para conectar-se novamente.",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Sair",
          onPress: () => signOut(),
        },
      ]
    );
  }

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Container>
            <Header>
              <HeaderTop>
                <BackButton color={theme.colors.shape} onPress={handleBack} />
                <HeaderTitle>Editar Perfil</HeaderTitle>
                <LogoutButton onPress={handleSignOut}>
                  <Feather name="power" size={24} color={theme.colors.shape} />
                </LogoutButton>
              </HeaderTop>

              <PhotoContainer>
                {!!avatar && (
                  <Photo
                    source={{
                      uri: avatar,
                    }}
                  />
                )}
                <PhotoButton onPress={handleSelectAvatar}>
                  <Feather name="camera" size={24} color={theme.colors.shape} />
                </PhotoButton>
              </PhotoContainer>
            </Header>

            <Content style={{ marginBottom: useBottomTabBarHeight() }}>
              <Options>
                <Option
                  active={option === "dataEdit"}
                  onPress={() => handleOptionChange("dataEdit")}
                >
                  <OptionTitle active={option === "dataEdit"}>
                    Dados
                  </OptionTitle>
                </Option>

                <Option
                  active={option === "passwordEdit"}
                  onPress={() => handleOptionChange("passwordEdit")}
                >
                  <OptionTitle active={option === "passwordEdit"}>
                    Mudar senha
                  </OptionTitle>
                </Option>
              </Options>

              {option === "dataEdit" ? (
                <Section>
                  <Input
                    iconName="user"
                    placeholder="Nome"
                    autoCorrect={false}
                    defaultValue={user.name}
                    onChangeText={setName}
                  />

                  <Input
                    iconName="mail"
                    editable={false}
                    defaultValue={user.email}
                  />

                  <Input
                    iconName="credit-card"
                    placeholder="CNH"
                    keyboardType="numeric"
                    defaultValue={user.driver_license}
                    onChangeText={setDriverLicense}
                  />
                </Section>
              ) : (
                <Section>
                  <InputPassword iconName="lock" placeholder="Senha atual" />
                  <InputPassword iconName="lock" placeholder="Nova senha" />
                  <InputPassword iconName="lock" placeholder="Repetir senha" />
                </Section>
              )}

              <Button title="Salvar alterações" onPress={handleProfileUpdate} />
            </Content>
          </Container>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
