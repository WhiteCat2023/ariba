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
import SubmitBtn from "../button/SubmitBtn";
import { Select } from "../ui/select";
import SelectInputWithFormControl from "../inputs/formControl/SelectInputWithFormControl";
import { TierList } from "@/enums/tier";

interface SendNewReportProps {
    isOpen: boolean;
    onClose: (value: boolean) => void;
}

interface ReportInput {
    title: string;
    description: string;
    tier: string;
    location: string;
    timestamp: string;
    images: string[];
}

interface ReportInputError {
    title: boolean;
    description: boolean;
    tier: boolean;
    location: boolean;
    timestamp: boolean;
    images: boolean;
}

const SendNewReport: React.FC<SendNewReportProps> = ({isOpen, onClose}) => {

    const [input, setInput] =  useState<ReportInput>({
        title:"",
        description: "",
        tier: "",
        location: "",
        timestamp: serverTimestamp() as unknown as string,
        images: []
    });

    const [isError, setError] =  useState<ReportInputError>({
        title: false,
        description: false,
        tier: false,
        location: false,
        timestamp: false,
        images: false
    });

    const handleChange = (field: keyof ReportInput, value: string) => {
        setInput((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    const validateInput = (): boolean => {
        if(input.title.trim() === ""){
            setError((prev) => ({
                ...prev,
                title: true,
            }));
            return;
        } else if (input.description.trim() === "") {
            setError((prev) => ({
                ...prev,
                description: true,
            }));
            return;
        } else if (input.tier.trim() === "") {
            setError((prev) => ({
                ...prev,        
                tier: true,
            }));
            return;
        }
        return;
    }

    const handleSubmit = () => {
        validateInput();
        console.log("Submitting report: ", input);
    }

    console.log("Modal state: ", isOpen);

    return (
        <Modal isOpen={isOpen} onClose={() => onClose(false)} size="lg" useRNModal={true}>
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
                            className: "lg:grid-cols-2 grid-cols-1 gap-4",
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

                                    <SelectInputWithFormControl 
                                        heading="Report TierList"
                                        subHeading="How urgent the report?"
                                        tier={TierList}
                                        placeholder="Select report tier"
                                        errorText="Please select a tier"
                                        helperText="This will help us prioritize the report"
                                        onValueChange={(value) => handleChange("tier", value)}
                                        selectedValue={input.tier}/>
                                        
                                    <SubmitBtn 
                                        onPress={handleSubmit}
                                        label="Submit Report" />
                                </VStack>
                        </GridItem>
                    </Grid>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default SendNewReport