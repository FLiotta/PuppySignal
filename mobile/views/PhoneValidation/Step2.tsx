// @Package
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

// @Project
import { COLORS } from 'styles';

// @Own
import styles from './styles';

interface IPhoneCodeValidation {
  phoneNumber: string
  onCodeValidate: (code: string) => void,
  onGoBack: () => void
}

const PhoneCodeValidation: React.FC<IPhoneCodeValidation> = ({
  phoneNumber,
  onCodeValidate,
  onGoBack
}) => {
  const CELL_COUNT = 6;
  
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

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
          💌
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
          One more step!
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            fontFamily: 'RedHatDisplayRegular',
          }}
        >
          Please enter the code we sent to: {'\n'} <Text style={{ fontWeight: '700' }}>{phoneNumber}</Text>
        </Text>
      </View>
      <View>
        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        <View style={{ marginTop: 25 }}>
          <Button 
              disabled={value.length != CELL_COUNT}
              title="Confirm"
              onPress={() => {
                if(value) {
                  onCodeValidate(value)
                }
              }}
            />
        </View>
        <View style={{ marginTop: 15 }}>
          <Button 
              title="Go back"
              onPress={onGoBack}
            />
        </View>
      </View>
    </View>
  );
}

export default PhoneCodeValidation;