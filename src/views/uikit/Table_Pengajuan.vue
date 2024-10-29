<script setup>
import { onMounted, ref } from 'vue';
const apiUrl = import.meta.env.VITE_API_URL;
const pengajuanList = ref([]);
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    userid: { value: null, matchMode: 'startsWith' },
    JenisBiaya: { value: null, matchMode: 'startsWith' },
    Nilai: { value: null, matchMode: 'equals' },
    Status: { value: null, matchMode: 'equals' },
    Tanggal: { value: null, matchMode: 'dateIs' }
});
const loading = ref(true);

// Fetch data from the API when the component mounts
onMounted(async () => {
    await fetchData();
});

async function fetchData() {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId'); // Ambil userId dari localStorage

    if (authToken && userId) {
        try {
            // Buat URL dengan query parameter untuk userId
            const response = await fetch(
                `${apiUrl}/pengajuan/list?userid=${userId}`,
                // const response = await fetch(`${apiUrl}/pengajuan/list?userid=1`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`Error: ${errorDetail}`);
            }

            const data = await response.json();
            pengajuanList.value = data;
        } catch (error) {
            console.error('Error fetching pengajuan list:', error);
            alert(`Error: ${error.message}`);
        } finally {
            loading.value = false;
        }
    } else {
        console.error('Token atau userId tidak ditemukan di localStorage');
        alert('Token atau userId tidak ditemukan. Silakan login kembali.');
        loading.value = false;
    }
}

// Function to format date
function formatDate(value) {
    return new Date(value).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Function to format value as currency
function formatCurrency(value) {
    return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

// Function to clear filters
function clearFilter() {
    filters.value.global.value = null;
    filters.value.userid.value = null;
    filters.value.JenisBiaya.value = null;
    filters.value.Nilai.value = null;
    filters.value.Status.value = null;
    filters.value.Tanggal.value = null;
}
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">List Pengajuan</div>
        <DataTable
            :value="pengajuanList"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            v-model:filters="filters"
            filterDisplay="menu"
            :loading="loading"
            :globalFilterFields="['userid', 'JenisBiaya', 'Nilai', 'Status', 'Tanggal']"
            showGridlines
        >
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters.global.value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>

            <template #empty> No data found. </template>
            <template #loading> Loading data. Please wait. </template>

            <Column field="userid" header="Username" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.UserId }}
                </template>
            </Column>

            <Column field="JenisBiaya" header="Jenis Pengajuan" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.JenisBiaya }}
                </template>
            </Column>

            <Column field="Nilai" header="Nilai" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ formatCurrency(data.Nilai) }}
                </template>
            </Column>

            <Column field="Status" header="Status" style="min-width: 12rem">
                <template #body="{ data }">
                    <Tag :value="data.Status" :severity="data.Status === 'Approved' ? 'success' : data.Status === 'Rejected' ? 'danger' : 'info'" />
                </template>
            </Column>

            <Column field="Tanggal" header="Tanggal" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ formatDate(data.Tanggal) }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
