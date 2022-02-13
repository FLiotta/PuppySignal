// @Package
import React, { useRef, useState } from 'react';
import { View, Text, Button } from 'react-native';
import PhoneInput from "react-native-phone-number-input";

// @Project
import { COLORS } from 'styles';


interface IPhoneRequest {
  onCodeRequest: (phonenumber: string) => void,
  codeRequestedDate: Date | undefined
}

const PhoneRequest: React.FC<IPhoneRequest> = ({
  onCodeRequest,
  codeRequestedDate
}) => {
  const [value, setValue] = useState<string | undefined>();
  const [formattedValue, setFormattedValue] = useState<string | undefined>();

  const phoneInput = useRef<PhoneInput>(null);

  return (
    <View style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
      flexDirection: 'column'
    }}>
      <View>
        <Text
          style={{
            fontSize: 75,
            textAlign: 'center',
            color: COLORS.primary_color,
            marginBottom: 10,
            fontFamily: 'RedHatDisplayRegular',
          }}
        >
          🤳
        </Text>
        <Text
          style={{
            marginTop: 25,
            fontSize: 22,
            textAlign: 'center',
            color: COLORS.primary_color,
            marginBottom: 10,
            fontFamily: 'RedHatDisplayRegular',
          }}
        >
          Verify your number
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            fontFamily: 'RedHatDisplayRegular',
          }}
        >
          Please enter your country and your phone number
        </Text>
      </View>
      <View>
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          layout="first"
          defaultCode="IT"
          onChangeText={(text) => {
            setValue(text);
          }}
          onChangeFormattedText={(text) => {
            setFormattedValue(text);
          }}
          countryPickerButtonStyle={{
            backgroundColor: '#eee',
            borderRadius: 8,
            paddingVertical: 10,
            height: 50,
          }}
          textContainerStyle={{
            backgroundColor: '#eee',
            height: 50,
            borderRadius: 8,
            marginLeft: 10,
          }}
          containerStyle={{
            width: '100%',
            display: 'flex',
            marginTop: 50
          }}
          withDarkTheme
        />
        <View style={{ marginTop: 50 }}>
          <Button
            title={"Send Valiation code!"}
            disabled={!formattedValue}
            onPress={() => {
              if(formattedValue) {
                onCodeRequest(formattedValue)
              }
            }}
          />
        </View>
      </View>
    </View>
  )
}

export default PhoneRequest;