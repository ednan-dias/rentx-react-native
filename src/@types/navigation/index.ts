import { CarDTO } from "../../dtos/CarDTO";

export type RootStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  SignUpFirstStep: undefined;
  SignUpSecondStep: {
    user: {
      name: string;
      email: string;
      driver_license: string;
    };
  };
  Home: undefined;
  CarDetails: {
    car: CarDTO;
  };
  Scheduling: {
    car: CarDTO;
  };
  SchedulingDetails: {
    car: CarDTO;
    dates: string[];
  };
  Confirmation: {
    title: string;
    message: string;
    nextScreen: keyof RootStackParamList;
  };
  MyCars: undefined;
};

export type RootBottomTabParamList = {
  Home: undefined;
  Profile: undefined;
  MyCars: undefined;
};
