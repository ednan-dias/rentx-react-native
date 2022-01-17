import { CarDTO } from "../../dtos/CarDTO";
import { Car as ModelCar } from "../../database/models/Car";

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
  HomeStack: undefined;
  CarDetails: {
    car: ModelCar;
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
  HomeBottom: undefined;
  Profile: undefined;
  MyCars: undefined;
};
