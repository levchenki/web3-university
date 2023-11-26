import {FC} from "react";
import {
    Button,
    Chip,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    Textarea
} from "@nextui-org/react";
import {usePoster} from "../../store/usePoster.ts";
import {FormikProvider, useFormik} from "formik";
import * as yup from 'yup'
import {IPostParams} from "../../types/posterInterfaces.tsx";
import {useAccount} from "../../store/useAccount.ts";
import {ModalProps} from "../../types/interfaces.ts";
import {toast} from "react-toastify";
import {SwitchPoster} from "../SwitchPoster.tsx";
import {useSwitchPoster} from "../../store/useSwitchPoster.ts";
import {shallow} from "zustand/shallow";
import {useGatedPoster} from "../../store/useGatedPoster.ts";
import {useToken} from "../../store/useToken.ts";

const postSchema = yup.object<IPostParams>().shape({
    tag: yup.string().required(),
    content: yup.string().required(),
})

export const ModalPosterCreation: FC<ModalProps> = ({onOpenChange, isOpen}) => {
    const {createPoster, isCreation} = usePoster((state => ({
        createPoster: state.createPoster,
        isCreation: state.isCreation,
    })), shallow);

    const {createGatedPoster, isGatedCreation, threshold} = useGatedPoster((state => ({
        createGatedPoster: state.createGatedPoster,
        isGatedCreation: state.isGatedCreation,
        threshold: state.threshold,
    })), shallow);

    const {isConnected} = useAccount();
    const balance = useToken(state => state.balance);
    const mode = useSwitchPoster(state => state.mode);
    const formik = useFormik<IPostParams>({
        initialValues: {
            tag: '',
            content: '',
        },
        initialTouched: {
            tag: false,
            content: false,
        },
        validationSchema: postSchema,
        onSubmit: async (values) => {
            const content = values.content;
            const tag = values.tag;

            if (mode === 'gated') {
                await createGatedPoster(content, tag).catch(e => toast.error(e.message))
            } else {
                await createPoster(content, tag).catch(e => toast.error(e.message))
            }
        },
    })

    const isGated = mode === 'gated';

    const notEnoughBalance = isGated && threshold > balance;

    const handleReset = () => {
        formik.resetForm()
        formik.setTouched({tag: false, content: false})
        onOpenChange()
    }

    return <Modal isOpen={isOpen} onOpenChange={handleReset}>
        <ModalContent>
            <FormikProvider value={formik}>
                <ModalHeader className="flex justify-between items-center mx-2">
                    Poster creation
                    <SwitchPoster/>
                </ModalHeader>
                <ModalBody className='items-center'>
                    {
                        notEnoughBalance && <Chip color='danger' variant='light'>
                            Not enough PudgeCoins to create gated post.
                        </Chip>
                    }
                    <Input
                        {...formik.getFieldProps('tag')}
                        placeholder="Enter the tag"
                        label='Tag'
                        isInvalid={formik.touched.tag && !!formik.errors.tag}
                        errorMessage={formik.touched.tag && formik.errors.tag}
                    />
                    <Textarea
                        {...formik.getFieldProps('content')}
                        placeholder="Enter post's content"
                        label='Content'
                        isInvalid={formik.touched.content && !!formik.errors.content}
                        errorMessage={formik.touched.content && formik.errors.content}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={handleReset}>
                        Close
                    </Button>
                    <Button color="primary" type='submit'
                            disabled={isCreation || !isConnected || notEnoughBalance}
                            onClick={() => formik.handleSubmit()}>
                        {
                            isCreation || isGatedCreation ? <Spinner color='white' size='sm'/> : 'Post'
                        }
                    </Button>
                </ModalFooter>
            </FormikProvider>
        </ModalContent>
    </Modal>
}