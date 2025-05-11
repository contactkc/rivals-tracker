import { useState } from 'react';
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
  requireConfirmation = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [confirmValue, setConfirmValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleToggle = () => setIsOpen(!isOpen);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // validation
    if (requireConfirmation && newValue !== confirmValue) {
      setError('Values do not match');
      return;
    }
    
    if (!newValue.trim()) {
      setError('This field cannot be empty');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSave(newValue);
      
      toaster.create({
        title: "Success",
        description: `${label} updated successfully`,
        type: "success",
      });
      
      setIsOpen(false);
      setNewValue('');
      setConfirmValue('');
    } catch (err) {
      setError(err.message || 'Failed to update');
      toaster.create({
        title: "Error",
        description: 'Failed to update',
        type: "error",
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
        <Button variant="outline" onClick={handleToggle} size="sm">
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
                  rounded="xl"
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
                    rounded="xl"
                    _focus={{ boxShadow: 'none', bg: 'gray.800' }}
                  />
                )}
                
                {error && <Text color="red.400" fontSize="sm">Failed to update</Text>}
                
                <Button
                  type="submit"
                  bg="white"
                  color="black"
                  rounded="xl"
                  w="full"
                  isLoading={isSubmitting}
                  loadingText="Saving"
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