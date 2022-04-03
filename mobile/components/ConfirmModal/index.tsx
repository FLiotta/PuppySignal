// @Packages
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native'
import Modal from "react-native-modal";

// @Project
import Loading from 'components/Loading'

interface IProps {
  title: string,
  description: string,
  visible: boolean,
  loading?: boolean,
  onAccept: () => void,
  onCancel: () => void,
}

const SizeSelectModal: React.FC<IProps> = ({
  title,
  description,
  visible,
  loading,
  onAccept,
  onCancel,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onCancel}
      onBackdropPress={onCancel}
    >
      <View style={styles.wrapper}>
        {loading && <Loading />}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>
          {description}
        </Text>
        <View style={styles.footer}>
          <Button
            color={"gray"}
            title='Decline'
            onPress={onCancel}
          />
          <Button
            color={"red"}
            title='Accept'
            onPress={onAccept}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    position: "relative",
    overflow: 'hidden'
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    margin: 20,
  },
  description: {
    margin: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#4444',
    backgroundColor: '#fff',
    padding: 5,
    marginTop: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 45,
    color: '#000',
  },
  footer: {
    width: "100%",
    padding: 25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-between",
    zIndex: 5
  }
});

export default SizeSelectModal;