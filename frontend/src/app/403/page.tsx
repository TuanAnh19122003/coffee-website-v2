'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const ForbiddenPage = () => {
    const router = useRouter();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>403 - Bạn không có quyền truy cập trang này</h1>
            <button onClick={() => router.push('/')} style={{ padding: '10px 20px', marginTop: '20px' }}>
                Quay về trang chủ
            </button>
        </div>
    );
};

export default ForbiddenPage;
