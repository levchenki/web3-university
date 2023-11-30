import { FC, useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
} from '@nextui-org/react';
import { FormikErrors, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { useAccount } from '../../store/useAccount.ts';
import { ModalProps } from '../../types/interfaces.ts';
import { useToken } from '../../store/useToken.ts';
import { Address } from 'abitype';
import { ITransactionParams } from '../../types/tokenInterfaces.tsx';
import { toast } from 'react-toastify';
import { strToBigint } from '../../utils/utils.ts';
import { MdArrowDropDown } from 'react-icons/md';

const postSchema = yup.object<ITransactionParams>().shape({
    to: yup.string().required('Required'),
    value: yup.number().required('Required').positive('Must be positive'),
});

export const ModalTokenTransaction: FC<ModalProps> = ({ onOpenChange, isOpen }) => {
    const { transfer, isTransferring, mint, getIsOwner } = useToken((state) => ({
        transfer: state.transfer,
        mint: state.mint,
        isTransferring: state.isTransferring,
        getIsOwner: state.getIsOwner,
    }));
    const [isOwner, setIsOwner] = useState(false);

    const { isConnected } = useAccount((state) => ({
        isConnected: state.isConnected,
    }));

    type TOption = Set<'transfer' | 'mint'>;
    const [selectedOption, setSelectedOption] = useState<TOption>(new Set(['transfer']));

    const formik = useFormik<ITransactionParams>({
        initialValues: {
            to: '' as Address,
            value: '',
        },
        initialTouched: {},
        validationSchema: postSchema,
        validate: async (values) => {
            const errors: FormikErrors<ITransactionParams> = {};

            if (!values.to.startsWith('0x')) {
                errors.to = 'Address must start with 0x';
            }

            return errors;
        },
        onSubmit: async (values) => {
            const valueBigint = strToBigint(values.value);

            if (selectedOption.has('mint')) {
                await mint(valueBigint, values.to)
                    .then(() => {
                        toast.success(`Minted to ${values.to}`);
                    })
                    .catch((e) => {
                        toast.error(e.message);
                    });
            } else {
                await transfer(valueBigint, values.to)
                    .then(() => {
                        toast.success(`Transferred to ${values.to}`);
                    })
                    .catch((e) => {
                        toast.error(e.message);
                    });
            }
        },
    });

    const handleReset = () => {
        formik.resetForm();
        formik.setTouched({ to: false, value: false });
        onOpenChange();
    };

    const handleSubmit = () => {
        formik.handleSubmit();
    };

    useEffect(() => {
        getIsOwner()
            .then(setIsOwner)
            .catch((e) => toast.error(e.message));
    }, [getIsOwner]);

    return (
        <Modal isOpen={isOpen} onOpenChange={handleReset}>
            <ModalContent>
                <FormikProvider value={formik}>
                    <ModalHeader className='flex flex-col gap-1'>
                        Token {selectedOption.has('transfer') ? 'transfer' : 'minting'}
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            {...formik.getFieldProps('to')}
                            placeholder='0x...'
                            label='Recipient'
                            isInvalid={formik.touched.to && !!formik.errors.to}
                            errorMessage={formik.touched.to && formik.errors.to}
                        />
                        <Input
                            {...formik.getFieldProps('value')}
                            placeholder='Enter the amount of tokens to send'
                            label='Amount'
                            isInvalid={formik.touched.value && !!formik.errors.value}
                            errorMessage={formik.touched.value && formik.errors.value}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color='danger' variant='light' onPress={handleReset}>
                            Close
                        </Button>
                        <ButtonGroup color='primary'>
                            <Button type='submit' disabled={isTransferring || !isConnected} onClick={handleSubmit}>
                                {isTransferring && <Spinner color='white' size='sm' />}
                                {selectedOption.has('transfer') ? 'Transfer' : 'Mint'}
                            </Button>
                            {isOwner && (
                                <Dropdown placement='bottom-end'>
                                    <DropdownTrigger>
                                        <Button isIconOnly color='primary'>
                                            <MdArrowDropDown />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        disallowEmptySelection
                                        aria-label='Merge options'
                                        selectedKeys={selectedOption}
                                        selectionMode='single'
                                        onSelectionChange={(keys) => setSelectedOption(keys as TOption)}
                                        className='max-w-[350px]'
                                    >
                                        <DropdownItem key='transfer'>Transfer</DropdownItem>
                                        <DropdownItem key='mint'>Mint</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            )}
                        </ButtonGroup>
                    </ModalFooter>
                </FormikProvider>
            </ModalContent>
        </Modal>
    );
};
