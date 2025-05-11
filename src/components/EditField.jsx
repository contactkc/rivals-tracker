import { useState, useEffect } from 'react';
import { 
  Box, Input, Button, Text, VStack, Flex, Spacer, Separator
} from '@chakra-ui/react';
import { FaRegEdit } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { toaster } from "@/components/ui/toaster";

const MotionBox = motion.create(Box);

function EditField({ 
  label, 
  value, 
  fieldType = 'text', 
  onSave, 
  placeholderValue = '',
  requireConfirmation = false,
  allowEmpty = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [confirmValue, setConfirmValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // initialize newValue with current value when component opens
  useEffect(() => {
    if (isOpen) {
      setNewValue(value || '');
    }
  }, [isOpen, value]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      // reset fields
      setNewValue('');
      setConfirmValue('');
      setError('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // validation
    if (!allowEmpty && !newValue.trim()) {
      setError('This field cannot be empty');
      return;
    }
    
    if (requireConfirmation && newValue !== confirmValue) {
      setError('Values do not match');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSave(newValue);
      
      toaster.create({
        title: "Success",
        description: `${label} updated successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
      
      setIsOpen(false);
      setNewValue('');
      setConfirmValue('');
    } catch (err) {
      setError('Failed to update');
      toaster.create({
        title: "Error",
        description: 'Failed to update',
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack spacing={2} align="stretch" width="100%">
      <Flex>
        <Text fontSize="md" fontWeight="600">
          {label}: {placeholderValue || (fieldType === 'password' ? '●●●●●●●●●' : value)}
        </Text>
        <Spacer />
        <Button variant="outline" onClick={handleToggle} size="sm" rounded="3xl">
          {isOpen ? 'Cancel' : 'Edit'} {!isOpen && <FaRegEdit style={{ marginLeft: '8px' }}/>}
        </Button>
      </Flex>
      
      <AnimatePresence>
        {isOpen && (
          <MotionBox
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            overflow="hidden"
          >
            <Separator my={2} borderColor="gray.600" />
            <form onSubmit={handleSubmit}>
              <VStack spacing={3} align="stretch" pt={2}>
                <Input
                  placeholder={`New ${label}`}
                  type={fieldType}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  bg="gray.800"
                  border="none"
                  rounded="3xl"
                  _focus={{ boxShadow: 'none', bg: 'gray.800' }}
                />
                
                {requireConfirmation && (
                  <Input
                    placeholder={`Confirm ${label}`}
                    type={fieldType}
                    value={confirmValue}
                    onChange={(e) => setConfirmValue(e.target.value)}
                    bg="gray.800"
                    border="none"
                    rounded="3xl"
                    _focus={{ boxShadow: 'none', bg: 'gray.800' }}
                  />
                )}
                
                {error && <Text color="red.400" fontSize="sm">Failed to update</Text>}
                
                <Button
                  type="submit"
                  w="full"
                  isLoading={isSubmitting}
                  loadingText="Saving"
                  bg="white"
                  rounded="3xl"
                >
                  Save {label}
                </Button>
              </VStack>
            </form>
          </MotionBox>
        )}
      </AnimatePresence>
    </VStack>
  );
}

export default EditField;