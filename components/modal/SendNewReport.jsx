import { uploadUserReport } from "@/api/controller/storage.controller";
import { useAuth } from "@/context/AuthContext";
import { HttpStatus } from "@/enums/status";
import { TierList } from "@/enums/tier";
import * as ImagePicker from "expo-image-picker";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import { Platform } from "react-native";
import SubmitBtn from "../button/SubmitBtn";
import WebMap from "../cards/components/WebMap";
import SelectInputWithFormControl from "../inputs/formControl/SelectInputWithFormControl";
import InputWithFormControl from "../inputs/InputWithFormControl";
import TextAreaWithFormControl from "../inputs/TextAreaWithFormControl";
import { Button, ButtonText } from "../ui/button";
import { Divider } from "../ui/divider";
import { Grid, GridItem } from "../ui/grid";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "../ui/modal";
import { VStack } from "../ui/vstack";

const SendNewReport = ({ isOpen, onClose }) => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        tier: "",
        location: [],
        timestamp: new Date(),
        images: [],
    });

    const [isError, setError] = useState({
        title: false,
        description: false,
        tier: false,
        location: false,
        images: false,
    });

    const {user} = useAuth()

    const handleChange = (field, value) => {
        setInput((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validateInput = () => {
        const errors = {
            title: input.title === "",
            description: input.description === "",
            tier: input.tier === "",
            location: input.location.length === 0,
            images: input.images.length === 0,
        };

        setError(errors);

        // return true if NO errors, false if there are errors
        return !Object.values(errors).some((val) => val === true);
        };

    const handleOnClose = () => {
        onClose(false);
        setInput({
        title: "",
        description: "",
        tier: "",
        location: [],
        timestamp: new Date(),
        images: [],
        });
        setError({
        title: false,
        description: false,
        tier: false,
        location: false,
        images: false,
        });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
        });

        if (!result.canceled && result.assets) {
        setInput((prev) => ({ ...prev, images: result.assets }));
        }
    };

    const handleSubmit = async () => {
        if (validateInput()) {
            const result = await uploadUserReport(input, user);
            if(result.status === HttpStatus.OK){
                handleOnClose()
            }
        }

        
        console.log("Submitting report: ", input);
        
    };

    return (
        <Modal isOpen={isOpen} onClose={() => onClose(false)} size={500} useRNModal={true}>
        <ModalBackdrop />
        <ModalContent className="rounded-lg max-h-[90%]">
            <ModalHeader>
            <Heading size="3xl" bold={true} className="text-center w-full">
                SUBMIT A REPORT
            </Heading>
            <ModalCloseButton onPress={() => handleOnClose()}>
                <Icon as={X} />
            </ModalCloseButton>
            </ModalHeader>
            <Divider className="my-4 " />
            <ModalBody>
            <Grid
                _extra={{
                className: "lg:grid-cols-2 grid-cols-1 gap-4",
                }}
            >
                <GridItem
                _extra={{
                    className: " col-span-1",
                }}
                >
                <VStack>
                    <InputWithFormControl
                    label="Report Title"
                    input={input.title}
                    setInput={handleChange.bind(null, "title")}
                    placeholder="Enter report title"
                    fallbackText="No title provided"
                    errorText="Title must not be empty"
                    isError={isError.title}
                    />
                    <TextAreaWithFormControl
                    label="Report Description"
                    input={input.description}
                    setInput={handleChange.bind(null, "description")}
                    placeholder="Write your report description here."
                    errorText="Description should not be empty"
                    isError={isError.description}
                    />

                    <SelectInputWithFormControl
                    heading="Report TierList"
                    subHeading="How urgent the report?"
                    tier={TierList}
                    placeholder="Select report tier"
                    errorText="Please select a tier"
                    helperText="This will help us prioritize the report"
                    onValueChange={(value) => handleChange("tier", value)}
                    selectedValue={input.tier}
                    isError={isError.tier}
                    />

                    <Button className="mb-4" onPress={pickImage}>
                    <ButtonText>Upload Image</ButtonText>
                    </Button>
                    <HStack></HStack>

                    <SubmitBtn onPress={handleSubmit} label="Submit Report" />
                </VStack>
                </GridItem>
                {Platform.OS === "web" && (
                    <GridItem
                        _extra={{
                            className: "w-[500px] col-span-1",
                        }}
                        >
                        <WebMap onChange={handleChange.bind(null, "location")} />
                    </GridItem>
                )}
                
            </Grid>
            </ModalBody>
        </ModalContent>
        </Modal>
    );
};

export default SendNewReport;
