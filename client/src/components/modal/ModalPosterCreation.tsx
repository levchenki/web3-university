import {FC} from "react";
import {
    Button,
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

const postSchema = yup.object<IPostParams>().shape({
    tag: yup.string().required(),
    content: yup.string().required(),
})

export const ModalPosterCreation: FC<ModalProps> = ({onOpenChange, isOpen}) => {
    const {createPoster, isCreation} = usePoster();
    const {isConnected} = useAccount()
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
            const tag = values.tag;
            const content = values.content;

            await createPoster(tag, content).catch(e=>toast.error(e.message))
        },
    })

    const handleReset = () => {
        formik.resetForm()
        formik.setTouched({tag: false, content: false})
        onOpenChange()
    }

    return <Modal isOpen={isOpen} onOpenChange={handleReset}>
        <ModalContent>
            <FormikProvider value={formik}>
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody>
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
                            disabled={isCreation || !isConnected}
                            onClick={() => formik.handleSubmit()}>
                        {
                            isCreation ? <Spinner color='white' size='sm'/> : 'Post'
                        }
                    </Button>
                </ModalFooter>
            </FormikProvider>
        </ModalContent>
    </Modal>
}