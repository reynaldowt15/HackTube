import { Button } from "react-native";

export default function PrimaryButton({ label, onPress }) {
    return (
        <Button
            title={label}
            onPress={onPress}
        />
    )
}