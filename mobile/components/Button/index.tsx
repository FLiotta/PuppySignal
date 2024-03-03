// @ Packages
import { TouchableOpacity, Text } from "react-native"

// @ Project
import { PRIMARY_COLOR, PRIMARY_COLOR_LIGHT } from "../../styles"


interface IProp {
  disabled?: boolean,
  text: string,
  light?: boolean,
  onPress: () => void
}

const Button: React.FC<IProp> = ({ disabled, text, onPress, light }) => {
  return (
    <TouchableOpacity
      style={{
        width: "100%",
        padding: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: disabled 
          ? "#eee" 
          : light ? PRIMARY_COLOR_LIGHT : PRIMARY_COLOR,
        borderRadius: 12
      }}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={{
          color: light ? PRIMARY_COLOR : "#fff",
          fontSize: 16,
          fontFamily: 'RedHatDisplayBlack',
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

export default Button