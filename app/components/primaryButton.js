import { Button } from "react-native";

export default function PrimaryButton({ title, onPress }) {
    return (
        <Button
            title={title}
            onPress={onPress}
        />
    )
}