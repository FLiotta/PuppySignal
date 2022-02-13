// @Package
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';

// @Project
import { refreshSessionToken } from 'actions/session';
import { requestPhoneNumberCode, validatePhoneNumberCode } from 'services/profile';

// @Own
import PhoneRequest from './Step1';
import CodeValidation from './Step2';
import styles from './styles';

const PhoneValidation: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [codeRequestedDate, setCodeRequestedDate] = useState<Date | undefined>();
  const dispatch = useDispatch();

  const onCodeRequest = (phoneNumber: string) => {
    requestPhoneNumberCode(phoneNumber)
      .then(() => {
        setCodeRequestedDate(new Date());
        setSelectedStep(1);
        setPhoneNumber(phoneNumber);
      })
      .catch((e) => {
        Toast.show({
          text1: "Ohm no! 🐶",
          text2: "There was an error requesting a code for your phone number, would you like to try again later?",
          type: "error",
          position: "bottom"
        })
      })
  }

  const onCodeValidate = (code: string) => {
    validatePhoneNumberCode(phoneNumber, code)
      .then(() =>  dispatch(refreshSessionToken()))
      .then(() => {
        Toast.show({
          text1: "Welcome abroad! 👩🏻‍✈️",
          text2: "We are really happy you joined us!🤗",
          type: "success",
          position: "bottom"
        })
      })
      .catch((e) => {
        Toast.show({
          text1: "Ohm no! 🐶",
          text2: "There was an error validating the code, would you like to try again later?",
          type: "error",
          position: "bottom"
        })
      })
  }

  return (
    <View style={styles.container}>
      {selectedStep === 0 && (
        <PhoneRequest
          codeRequestedDate={codeRequestedDate}
          onCodeRequest={onCodeRequest}
        />
      )}
      {selectedStep === 1 && (
        <CodeValidation
          phoneNumber={phoneNumber}
          onCodeValidate={onCodeValidate}
          onGoBack={() => {
            setSelectedStep(0);
            setPhoneNumber('');
          }}
        />
      )}
    </View>
  );
}

export default PhoneValidation;