import { X } from "lucide-react-native";
import { Heading } from "../ui/heading";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "../ui/modal"
import { Icon } from "../ui/icon";
import { Divider } from "../ui/divider";
import { Grid, GridItem } from "../ui/grid";
import { useState } from "react";
import InputWithFormControl from "../inputs/InputWithFormControl";
import TextAreaWithFormControl from "../inputs/TextAreaWithFormControl";
import { VStack } from "../ui/vstack";
import { serverTimestamp } from "firebase/firestore";
import React from "react";

interface SendNewReportProps {
    isOpen: boolean;
    onClose: (value: boolean) => void;
}

interface ReportInput {
    title: string;
    description: string;
    category: string;
    location: string;
    timestamp: string;
    images: string[];
}

const SendNewReport: React.FC<SendNewReportProps> = ({isOpen, onClose}) => {

    const [input, setInput] =  useState<ReportInput>({
        title:"",
        description: "",
        category: "",
        location: "",
        timestamp: serverTimestamp() as unknown as string,
        images: []
    });

    const handleChange = (field: keyof ReportInput, value: string) => {
        setInput((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    console.log("Modal state: ", isOpen);

    return (
        <Modal isOpen={isOpen} onClose={() => onClose(false)} size="lg">
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading size="3xl" bold={true} className="text-center w-full">SUBMIT A REPORT</Heading>
                    <ModalCloseButton onPress={() => onClose(false)}>
                        <Icon as={X}/>
                    </ModalCloseButton>
                </ModalHeader>
                <Divider className="my-4 "/>
                <ModalBody>
                    <Grid
                        _extra={{
                            className: "lg:grid-cols-2 gap-4",
                        }}>
                        <GridItem
                            _extra={{
                                className: "col-span-1"}}>
                                <VStack>
                                    <InputWithFormControl
                                        label="Report Title"
                                        input={input.title}
                                        setInput={handleChange.bind(null, 'title')}
                                        placeholder="Enter report title"
                                        fallbackText="No title provided"
                                        errorText="Title must not be empty"

                                        />
                                    <TextAreaWithFormControl
                                        label="Report Description"
                                        input={input.description}
                                        setInput={handleChange.bind(null, "description")}
                                        placeholder="Write your report description here."
                                        errorText="Description should not be empty"/>
                                </VStack>
                        </GridItem>
                    </Grid>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default SendNewReport