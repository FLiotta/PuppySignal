// @Packages
import React from 'react';
import { View, ActivityIndicator } from 'react-native'

// @Own
import { COLORS } from 'styles'; 

const SizeSelectModal: React.FC = () => {
  return (
    <View 
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        zIndex: 1000
      }}
    >
      <View
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          opacity: 0.8,
        }}
      >
      </View>
      <ActivityIndicator 
        size={"large"} 
        color={COLORS.primary_color} 
        style={{ zIndex: 10 }}
      />
    </View>
  )
}

export default SizeSelectModal;