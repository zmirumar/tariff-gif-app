'use client';

import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message, Spin, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAdminTariffsQuery } from '@/hooks/queries';
import { useCreateTariffMutation, useUpdateTariffMutation, useDeleteTariffMutation } from '@/hooks/mutations';
import TariffCard from '@/components/TariffCard';
import type { ITariff } from '@/types/interfaces';
import { 
  PageWrapper, 
  PageHeader, 
  HeaderLeft, 
  PageTitle, 
  PageSubtitle, 
  PageGrid,
  CenteredSpinner,
  StyledEmpty,
  ModalTitleWrapper,
  StyledTagsIcon,
  StyledEditIcon,
  FullWidthInputNumber,
  FormFooterItem,
  ModalFooterFlex,
  CancelButton
} from './style';

export default function AdminTariffsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<ITariff | null>(null);
  
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data: tariffs = [], isLoading, error } = useAdminTariffsQuery();

  useEffect(() => {
    if (error) {
      message.error('Failed to load tariffs');
    }
  }, [error]);

  const createMutation = useCreateTariffMutation({
    onSuccess: (created) => {
      message.success(`Tariff "${created.name}" created successfully!`);
      setIsCreateModalOpen(false);
      createForm.resetFields();
    },
    onError: () => {
      message.error('Failed to create tariff');
    },
  });

  const updateMutation = useUpdateTariffMutation({
    onSuccess: (updated) => {
      message.success(`Tariff "${updated.name}" updated successfully!`);
      setIsEditModalOpen(false);
      setSelectedTariff(null);
      editForm.resetFields();
    },
    onError: () => {
      message.error('Failed to update tariff');
    },
  });

  const deleteMutation = useDeleteTariffMutation({
    onSuccess: () => {
      message.success('Tariff deleted successfully!');
      setIsEditModalOpen(false);
      setSelectedTariff(null);
      editForm.resetFields();
    },
    onError: () => {
      message.error('Failed to delete tariff');
    },
  });

  const handleDeleteTariff = () => {
    if (!selectedTariff) return;
    deleteMutation.mutate(selectedTariff.id);
  };

  const handleCreateTariff = (values: {
    name: string;
    duration_months: number;
    price: number;
    description: string;
  }) => {
    createMutation.mutate({
      name: values.name,
      description: values.description,
      duration_months: values.duration_months,
      price: values.price,
      is_active: true,
    });
  };

  const handleEditTariff = (values: {
    name: string;
    duration_months: number;
    price: number;
    description: string;
  }) => {
    if (!selectedTariff) return;
    updateMutation.mutate({
      id: selectedTariff.id,
      tariff: {
        name: values.name,
        description: values.description,
        duration_months: values.duration_months,
        price: values.price,
      },
    });
  };

  const handleCardClick = (id: string) => {
    const tariff = tariffs.find((t) => t.id === id);
    if (!tariff) return;
    setSelectedTariff(tariff);
    editForm.setFieldsValue({
      name: tariff.name,
      duration_months: tariff.duration_months,
      price: tariff.price,
      description: tariff.description,
    });
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <CenteredSpinner>
          <Spin size="large" />
        </CenteredSpinner>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader>
        <HeaderLeft>
          <PageTitle>Manage Tariffs</PageTitle>
          <PageSubtitle>Create or edit plans. Click on any card to update its details.</PageSubtitle>
        </HeaderLeft>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Tariff
        </Button>
      </PageHeader>

      {tariffs.length === 0 ? (
        <StyledEmpty description="No tariffs yet. Create your first one!" />
      ) : (
        <PageGrid>
          {tariffs.map((tariff) => (
            <TariffCard
              key={tariff.id}
              id={tariff.id}
              name={tariff.name}
              price={tariff.price}
              description={tariff.description}
              durationMonths={tariff.duration_months}
              isAdmin={true}
              onClick={handleCardClick}
            />
          ))}
        </PageGrid>
      )}

      <Modal
        title={
          <ModalTitleWrapper>
            <StyledTagsIcon />
            <span>Create New Tariff</span>
          </ModalTitleWrapper>
        }
        open={isCreateModalOpen}
        onCancel={() => { setIsCreateModalOpen(false); createForm.resetFields(); }}
        footer={null}
        destroyOnClose
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateTariff} initialValues={{ duration_months: 1, price: 10 }}>
          <Form.Item name="name" label="Tariff Name" rules={[{ required: true, message: 'Required!' }]}>
            <Input placeholder="e.g., VIP Platinum" />
          </Form.Item>
          <Form.Item name="duration_months" label="Active Duration (Months)" rules={[{ required: true }, { type: 'number', min: 1 }]}>
            <FullWidthInputNumber min={1} placeholder="e.g., 3" />
          </Form.Item>
          <Form.Item name="price" label="Price ($)" rules={[{ required: true }, { type: 'number', min: 0 }]}>
            <FullWidthInputNumber min={0} placeholder="e.g., 29" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Required!' }]}>
            <Input.TextArea rows={3} placeholder="Features included in this tariff..." />
          </Form.Item>
          <FormFooterItem>
            <CancelButton onClick={() => { setIsCreateModalOpen(false); createForm.resetFields(); }}>Cancel</CancelButton>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending}>Create</Button>
          </FormFooterItem>
        </Form>
      </Modal>

      <Modal
        title={
          <ModalTitleWrapper>
            <StyledEditIcon />
            <span>Edit Tariff: {selectedTariff?.name}</span>
          </ModalTitleWrapper>
        }
        open={isEditModalOpen}
        onCancel={() => { setIsEditModalOpen(false); setSelectedTariff(null); editForm.resetFields(); }}
        destroyOnClose
        footer={[
          <ModalFooterFlex key="edit-footer">
            <Popconfirm
              title="Delete the tariff"
              description={`Are you sure you want to delete "${selectedTariff?.name}"?`}
              onConfirm={handleDeleteTariff}
              okText="Yes, Delete"
              cancelText="No"
              okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
            >
              <Button 
                type="primary" 
                danger 
                icon={<DeleteOutlined />} 
                loading={deleteMutation.isPending}
              >
                Delete Tariff
              </Button>
            </Popconfirm>
            <div>
              <CancelButton 
                onClick={() => { setIsEditModalOpen(false); setSelectedTariff(null); editForm.resetFields(); }}
              >
                Cancel
              </CancelButton>
              <Button 
                type="primary" 
                onClick={() => editForm.submit()} 
                loading={updateMutation.isPending}
              >
                Save Changes
              </Button>
            </div>
          </ModalFooterFlex>
        ]}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditTariff}>
          <Form.Item name="name" label="Tariff Name" rules={[{ required: true, message: 'Required!' }]}>
            <Input placeholder="e.g., VIP Platinum" />
          </Form.Item>
          <Form.Item name="duration_months" label="Active Duration (Months)" rules={[{ required: true }, { type: 'number', min: 1 }]}>
            <FullWidthInputNumber min={1} placeholder="e.g., 3" />
          </Form.Item>
          <Form.Item name="price" label="Price ($)" rules={[{ required: true }, { type: 'number', min: 0 }]}>
            <FullWidthInputNumber min={0} placeholder="e.g., 29" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Required!' }]}>
            <Input.TextArea rows={3} placeholder="Features included in this tariff..." />
          </Form.Item>
        </Form>
      </Modal>
    </PageWrapper>
  );
}
