import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        jenis_transaksi: {
            type: String,
            required: true,
        },
        saldo: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Kasir = mongoose.model('Kasir', userSchema);

export default Kasir;