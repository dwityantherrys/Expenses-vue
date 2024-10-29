<script setup>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Steps from 'primevue/steps';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue'; // Add computed import here

const pengajuanList = ref([]);
const jenis_biaya = ref([]);
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    userid: { value: null, matchMode: 'startsWith' },
    JenisBiaya: { value: null, matchMode: 'startsWith' },
    Nilai: { value: null, matchMode: 'equals' },
    Status: { value: null, matchMode: 'equals' },
    Tanggal: { value: null, matchMode: 'dateIs' }
});

const apiUrl = import.meta.env.VITE_API_URL;
const loading = ref(true);
const itemDialog = ref(false);
const currentStep = ref(0);
const nilai = ref('');
const deadline = ref('');
const item = ref({});
const toast = useToast();

const steps = ref([
    { label: 'Pilih Jenis Pengajuan', icon: 'pi pi-folder' },
    { label: 'Detail Pengajuan', icon: 'pi pi-pencil' },
    { label: 'Preview Pengajuan', icon: 'pi pi-eye' }
]);

async function fetchJenisBiaya() {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        try {
            const response = await fetch(`${apiUrl}/pengajuan/jenis`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`Error: ${errorDetail}`);
            }

            const data = await response.json();
            jenis_biaya.value = data.map((item) => ({
                label: item.FV_DESKRIPSI,
                value: item.FC_KODE
            }));
        } catch (error) {
            console.error('Error fetching jenis pengajuan:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: `Error fetching jenis pengajuan: ${error.message}`, life: 3000 });
        }
    } else {
        console.error('Token tidak ditemukan di localStorage');
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Token tidak ditemukan. Silakan login kembali.', life: 3000 });
    }
}

onMounted(async () => {
    await fetchJenisBiaya();
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

async function saveItem() {
    const UserId = localStorage.getItem('userId');
    // const Branch = localStorage.getItem('branch');
    const newItem = {
        Userid: `${UserId}`,
        // Branch: `${Branch}`,
        JenisBiaya: item.value.JenisBiaya,
        Nilai: parseFloat(nilai.value) || 0,
        // Tanggal: deadline.value,
        Status: 'Testing'
    };
    console.log('Item yang akan disimpan:', newItem);
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        try {
            const response = await fetch(`${apiUrl}/pengajuan/insert`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`Error: ${errorDetail}`);
            }

            await fetchData(); // Refresh  pengajuan list

            toast.add({ severity: 'success', summary: 'Successful', detail: 'Pengajuan Saved', life: 3000 });
            resetForm();
            hideDialog();
        } catch (error) {
            console.error('Error saving pengajuan:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: `Error saving pengajuan: ${error.message}`, life: 3000 });
        }
    } else {
        console.error('Token tidak ditemukan di localStorage');
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Token tidak ditemukan. Silakan login kembali.', life: 3000 });
    }
}

function resetForm() {
    currentStep.value = 0;
    nilai.value = '';
    deadline.value = '';
    item.value = {};
}

function openNew() {
    resetForm();
    itemDialog.value = true;
}

function hideDialog() {
    itemDialog.value = false;
}

const selectedJenisBiaya = computed(() => {
    const selected = jenis_biaya.value.find((pengajuan) => pengajuan.value === item.value.JenisBiaya);
    return selected ? selected.label : 'Unknown';
});
</script>

<template>
    <div>
        <div class="card">
            <div class="font-semibold text-xl mb-4">Input Pengajuan</div>
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
                        <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2 mb-2" @click="openNew" />
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

        <Dialog v-model:visible="itemDialog" header="Form Pengajuan" :modal="true" :style="{ width: '50vw' }">
            <Steps :model="steps" :activeIndex="currentStep" />

            <div v-if="currentStep === 0" class="mt-4">
                <label for="JenisBiaya" class="font-bold mb-3">Pilih Jenis Pengajuan</label>
                <Select id="JenisBiaya" v-model="item.JenisBiaya" :options="jenis_biaya" optionLabel="label" optionValue="value" placeholder="Pilih Jenis Pengajuan" fluid />
            </div>

            <div v-if="currentStep === 1" class="mt-4">
                <label for="nilai" class="block font-bold mb-3">Nilai</label>
                <InputText id="nilai" class="w-full" v-model="nilai" placeholder="Masukkan Nilai" />
                <label for="deadline" class="block font-bold mb-3 mt-4">Deadline</label>
                <InputText id="deadline" class="w-full" v-model="deadline" type="date" />
            </div>

            <div v-if="currentStep === 2" class="mt-4">
                <h3>Preview</h3>
                <p><b>Jenis Pengajuan:</b> {{ selectedJenisBiaya }}</p>
                <p><b>Nilai:</b> {{ nilai }}</p>
                <p><b>Deadline:</b> {{ deadline }}</p>
            </div>

            <template #footer>
                <div class="footer-actions pr-2 pl-2" style="display: flex; justify-content: space-between">
                    <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                    <div>
                        <Button class="mr-2 ml-2" v-if="currentStep > 0" label="Back" icon="pi pi-arrow-left" @click="currentStep--" />
                        <Button v-if="currentStep < 2" label="Next" icon="pi pi-arrow-right" @click="currentStep++" />
                        <Button v-if="currentStep === 2" label="Save" icon="pi pi-check" @click="saveItem" />
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<style scoped></style>
